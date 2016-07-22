import Chart from 'chart.js'
import { writeFile, notify } from './utils'

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

/* Prompt the the user to export the current answer labels and votes in a CSV file format */

export function exportValuesToCsv(question, answers, votes) {
  var data = new Blob([(answers.join(",") + "\n" + votes.join(","))], {type : 'text/plain'});
  var fileName = question.replace(/\W+/g, '-').toLowerCase(); // replace invalid characters
  fileName = fileName.replace(/(^-|-$)/g, ""); // remove any preceding or trailing -'s

  writeFile(data, {name: fileName, extensions: ['csv']}, function(err) {
    if (err && err.message !== "User cancelled") {
      err.iconUrl = "img/disconnected.svg";
      err.title = "Failed to Export Results";
      err.message += "\nYou may not have write access to the selected folder";
      notify(err);
    }
    else {
      notify({
        title: "Results Exported Succesfully",
        message: "Your results for '" + question + "' were exported succesfully"
      });
    }
  });
}

/*
Redraws the chart with new chartLabels, chartDataLabel, chartData and background colour
*/

export function updateChart(newLabels, newData, colourArray) {
  myChart.data.labels = newLabels;
  myChart.data.datasets[0].data = newData;
  myChart.data.datasets[0].backgroundColor = colourArray;
  myChart.update();
}
