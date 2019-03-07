// Vue
new Vue({
  el: '#app',
  data () {
    return {
      apartments: null,
      activeApartment: null,
      activeIndex: undefined,
      priceChart: undefined,
    }
  },
  mounted () {
    axios.get('./listings')
      .then(response => (this.apartments = response.data))
      
    this.createChart("priceChart");
  },
  methods: {
    getApartment: function(apartment, index) {
      this.activeIndex = index;
    
      axios.get(`./listings/${apartment._id}`)
        .then(response => {
          this.activeApartment = response.data;
          
          const terms = response.data.terms;
          const labels = terms.map(x => x.scrape_dt);
          const price10 = { label: '10', data: terms.map(x => x.price_10) }
          const price11 = { label: '11', data: terms.map(x => x.price_11) }
          const price12 = { label: '12', data: terms.map(x => x.price_12) }
          
          this.setData(labels, [price10, price11, price12]);
        });
    },
    createChart: function(chartId) {
      const ctx = document.getElementById(chartId);
      // Save reference
      this.priceChart = new Chart(ctx, {
        type: 'line',
        options: {
        	plugins: {
            colorschemes: { scheme: 'tableau.Tableau10' }
          },
          scales: {
            yAxes: [{
              ticks: { beginAtZero: false }
            }]
          },
          elements: {
            line: { fill: false }
          }
        }
      });
    },
    setData: function(labels, datasets) {
      // Use reference
      this.priceChart.data.labels = labels;
      this.priceChart.data.datasets = datasets;
      this.priceChart.update();
    }
  }
});
