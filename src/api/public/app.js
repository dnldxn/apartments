const img = require("./img/*.png");
const pdf = require("./img/*.pdf");

import Vue from 'vue';
import axios from 'axios';
import Sortable from 'sortablejs';
import Chart from 'chart.js';
import 'chartjs-plugin-colorschemes';


// Helper Function
function covertCurrencyString(value) {
  return value.toLocaleString("en-US", { 
    style:"currency",
    currency:"USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}


// Apartment List Item Component
Vue.component('apartment-list-item', {
  props: {
    apt: Object
  },
  template: `
    <a
      v-bind:data-id="apt._id"
      class="list-group-item list-group-item-action"
      v-bind:class="{ 'list-group-item-danger': apt.display === false }"
      v-on:click="selectApartment"
      href="#">
        <div class="row">
          <h5 class="col-11">{{apt.apartment}} #{{apt.unit}}</h5>
          <button type="button" class="col-1 close float-right" v-on:click.stop="closeButtonClicked">
            <span>&times;</span>
          </button>
        </div>
        <h6>\${{apt.minPrice}}</h6>
        <br />
        <small>Sq Ft: <b>{{apt.size}}</b> Floor: <b>{{apt.floor}}</b> Available: <b>{{apt.available_dt}}</b></small>
    </a>
  `,
  methods: {
    selectApartment() {
      this.$emit('apartment-selected');
    },
    closeButtonClicked() {
      this.$emit('apartment-close-clicked');
    }
  }
});


// Apartment Details Pane
Vue.component('apartment-details', {
  props: {
    unitImg: String,
    complexImg: String,
    complexPDF: String
  },
  template: `
    <div class="col-7 col-md-9">
      <img id="unit_img" v-bind:src="unitImg"></img>
      <canvas id="price_chart" height="100"></canvas>
      <img id="complex_img" v-bind:src="complexImg"></img>
      <embed v-bind:src="complexPDF" width="600" height="500" alt="pdf">
    </div>
  `
});



// Vue
new Vue({
  el: '#app',
  data () {
    return {
      apartments: null,
      activeIndex: undefined,
      priceChart: undefined,
      complexImg: undefined,
      complexPDF: undefined,
      unitImg: undefined,
    }
  },
  mounted () {
    axios.get('./listings')
      .then(response => {
        this.apartments = response.data;
        
        // By default, select the first apartment in the list
        this.getApartment(0, this.apartments[0]._id);
        
        // Setup the sortable list
        let el = document.getElementsByClassName('sortable')[0];
        this.sortable = Sortable.create(el, {
          delay: 100,   // time in milliseconds to define when the sorting should start
          store: {
            set: function(sortable) {
              
              const listings = Array.from(document.getElementsByClassName('list-group-item'));
              const numListings = listings.length;
              
              let orderObject = {};
              [].forEach.call(listings, function (listing, i) {
                const listingID = listing.getAttribute('data-id');
                orderObject[listingID] = numListings - i;  // need to reverse the sort id order due to the way Mongo sorts nulls
              });
              
              axios.post('./listings/sort', orderObject);
            }
          }
        });
      })

    this.createChart("price_chart");
  },
  methods: {
    
    getApartment: function(index) {
      this.activeIndex = index;
      const apartment_id = this.apartments[index]._id;
      
      axios.get(`./listings/${apartment_id}`)
        .then(response => {
          const activeApartment = response.data;

          this.switchImages(activeApartment['apartment'], activeApartment['size'])

          const terms = activeApartment.terms;
          const labels = terms.map(x => x.dt);
          
          // collect the keys (term length) and prices (over time)
          const datasets = {}
          terms.forEach( (dt) => {
            dt.price.forEach( (p) => {
              if(!datasets[p.k]) datasets[p.k] = []
              datasets[p.k].push(p.v);
            })
          });

          const datasets2 = []
          for (var term in datasets) {
            datasets2.push( { "label": term, "data": datasets[term] } );
          }

          this.setData(labels, datasets2);
        });
    },
    
    toggleApartmentDisplay: function(hideIndex) {
      const apartment = this.apartments[hideIndex];
      
      const current = apartment['display'];
      const next = !current;
      
      apartment['display'] = next;  // update UI
      axios.post(`./listings/${apartment._id}/hide`, {'display': next});  // update DB
    },
    
    createChart: function(chartId) {
      const ctx = document.getElementById(chartId);
      this.priceChart = new Chart(ctx, {
        type: 'line',
        options: {
        	plugins: { colorschemes: { scheme: 'tableau.Tableau10' } },
          scales: {
            yAxes: [{
              ticks: { 
                beginAtZero: false,
                callback: covertCurrencyString
              }
            }]
          },
          elements: { line: { fill: false } },
          hover: {
            mode: 'nearest',
            intersect: false
          },
          tooltips: {
            mode: 'nearest',
            intersect: false,
            callbacks: { label: (tooltipItems, data) =>  covertCurrencyString(tooltipItems.yLabel) }
          }
        }
      });
    },
    
    setData: function(labels, datasets) {
      this.priceChart.data.labels = labels;
      this.priceChart.data.datasets = datasets;
      this.priceChart.update();
    },
    
    switchImages: function(apartment, size) {
      const apartment_nm = apartment.toLowerCase().replace(/ /g, '_');
      this.complexImg = img[`${apartment_nm}_complex`];
      this.complexPDF = pdf[`${apartment_nm}_complex`];
      this.unitImg = img[`${apartment_nm}_${size}`];
    }
  }
});
