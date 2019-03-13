// Helper Function
function covertCurrencyString(value) {
  return value.toLocaleString("en-US", { 
    style:"currency",
    currency:"USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

// Vue
new Vue({
  el: '#app',
  data () {
    return {
      apartments: null,
      activeApartment: null,
      activeIndex: undefined,
      priceChart: undefined,
      complexImg: undefined,
      unitImg: undefined,
    }
  },
  mounted () {
    axios.get('./listings')
      .then(response => {
        this.apartments = response.data;
        
        this.getApartment(this.apartments[0], 0);
        
        let el = document.getElementsByClassName('sortable')[0];
        this.sortable = Sortable.create(el, {
          store: {
            set: function(sortable) {
              
              const listings = Array.from(document.getElementsByClassName('list-group-item'));
              const numListings = listings.length
              
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
    getApartment: function(apartment, index) {
      this.activeIndex = index;
    
      axios.get(`./listings/${apartment._id}`)
        .then(response => {
          this.activeApartment = response.data;

          this.switchImages(this.activeApartment['apartment'], this.activeApartment['size'])

          const terms = response.data.terms;
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
      this.complexImg = `img/${apartment_nm}_complex.png`;
      this.unitImg = `img/${apartment_nm}_${size}.png`;
    }
  }
});
