import Chart from 'chart.js'
import { notify } from './utils'

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
  function onError(err) {
    if (err.message === "User cancelled")
      return;
    err.iconUrl = "img/disconnected.svg";
    err.title = "Failed to Export Results";
    err.message += "\nYou may not have write access to the selected folder";
    notify(err);
  }

  question = question.replace(/\W+/g, '-').toLowerCase();

  chrome.fileSystem.chooseEntry(
    {
      type: 'saveFile',
      suggestedName: question,
      accepts: [
        {
          // force a CSV extension
          description: 'CSV files only (*.csv)',
          extensions: ['csv']}
      ],
      acceptsAllTypes: false
    },
    function(writableFileEntry) {
      if (chrome.runtime.lastError) {
        onError(chrome.runtime.lastError);
        return;
      }
      writableFileEntry.createWriter(
        function(writer) {
          var truncated = false;
          var blob = new Blob([(answers.join(",") + "\n" + votes.join(","))], {type : 'text/plain'});
          writer.onerror = function(err) {
            onError(err);
          };
          writer.onwriteend = function(e) {
            if (!truncated) {
              truncated = true;
              this.truncate(blob.size); // if the file already exists, erase any old data
              return;
            }
            notify({
              title: "Results Exported Succesfully",
              message: "Your results for '" + question + "' were exported succesfully"
            });
          };
          writer.write(blob);
        },
        function(err) {
          onError(err);
        }
      );
    }
  );
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
