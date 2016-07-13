import Chart from 'chart.js'

var chartLabels = [];			// An array of strings. Each datapoint should have a label otherwise they won't show on the chart
var chartData = [];				// The datapoints of the chart, the number of datapoints should match the number of labels
var chartBackgroundColor = [];	// An array of colours for each datapoint. Automatically generated in the updateData() function

var	chartType = 'bar'; 			// OPTIONS: 'line', 'bar', 'radar', 'polarArea', 'pie', 'doughnut'

var ctx;
var myChart;

/*
Initialises the chart
*/

export function runChart() {
  ctx = document.getElementsByClassName("voteResults")[0];
  myChart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: chartLabels,
      datasets: [{
        label: '',
        data: chartData,
        backgroundColor: chartBackgroundColor,
        borderWidth: 1
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true,
            stepSize: 1
          }
        }]
      },
      legend: {
        display: false
      }
    }
  });
  updateChart([], [], []);
}

/*
Redraws the chart with new chartLabels, chartDataLabel, chartData and background colour
*/

export function updateChart(newLabels, newData, colourArray){
myChart.data.labels = newLabels;
myChart.data.datasets[0].data = newData;
myChart.data.datasets[0].backgroundColor = colourArray;
myChart.update();
}
