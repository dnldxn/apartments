// Charts
const ctx = document.getElementById("priceChart").getContext('2d');
const price_chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: undefined,
    datasets: undefined,
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: false
        }
      }]
    },
    elements: {
      line: {
        fill: false
      }
    }
  }
});


// $('.list-group-item').on('click', function(e) {
//   var $this = $(this);
  
//   var id = $this.attr('href').replace('#', '').replace('_', '')
//   var lease = data.find(o => o.id === parseInt(id))

//   price_chart.config.data.labels = lease['lease_dt']
//   price_chart.config.data.datasets = lease['lease_price']
//   price_chart.update()
// })
