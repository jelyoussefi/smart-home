/*
// Copyright (c) 2018 Intel Corporation
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
*/

smartHomeApp.controller('outputController', ['$scope','settings','socket', function ($scope,settings,socket) {
	$scope.settings = settings;
	
	$scope.labels = [];
	$scope.data = [];
	$scope.series = [];
	$scope.dataLabels = [];
	$scope.displayType = "chart"
  	$scope.chartType = "line"

	$scope.datasetOverride = [{ yAxisID: 'y-axis-1'}, { yAxisID: 'y-axis-2'}];
	
	$scope.colors = [
			{
		      backgroundColor:'rgba(255, 99, 132, 0.2)',
		      borderColor:'rgba(255, 99, 132, 0.3)'
			},
			{
		      backgroundColor:'rgba(54, 162, 235, 0.2)',
		      borderColor:'rgba(54, 162, 235, 0.3)'
			}
		];
	
	$scope.options = {
		plugins: {
					datalabels: {
						display: false,
						font: {
							family: "'Open Sans', sans-serif",
							weight: 'bold',
							size: 16

						},
						anchor: "end",
						align:  "start",
						offset: 2,
						formatter: function(value, context) {
    						return $scope.dataLabels[context.dataIndex]
						}
					}
				},

		scales: {
					xAxes: [{
					    ticks: {
		                  fontColor: 'rgba(0, 0, 0, 1)',
		                  fontSize: 14
		                },
			            gridLines: {
					                display:true,
					                drawOnChartArea: false,
					                lineWidth: 2
					            },
					    type: 'time'
			            
			        }],
				    yAxes: 
				    	[
				    		{
				    			id: 'y-axis-1',
				    			position: 'left',
								scaleLabel: {
									display: true,
									labelString: '',
									fontColor: 'rgba(0, 0, 0, 1)',
									fontSize: 16,
									},
								ticks: {
								    beginAtZero:true
								},
								gridLines: {
					                display: false
					            } 
						    }
						]
	  	},

	  	legend: {
	  		display: true,
	  		position: 'top'
	  	},

 

	  	elements: {
		            line: {
		                fill: false,
		                borderColor: 'rgba(255,0,0,0.8)'
		            },
		            point: {
		            	radius: 3
		            }
        }
	}

  	$scope.reset = function() {
  		$scope.options.plugins.datalabels.display = false;
		$scope.labels = [];
		$scope.data = [];
		$scope.series = [];
		$scope.dataLabels = [];
		
  	}

  
  
	socket.on('data', function(data) {
		if ( $scope.settings.currentSensor && $scope.settings.currentSensor.id == data.id ) {
			$scope.labels.push(data.ts)
			$scope.data[0].push(data.value)
		}
		
	})

	$scope.$watchCollection('settings.currentSensor' , function(currentSensor) {

		if ( currentSensor ) {
			$scope.reset()
			$scope.data[0] = []
			$scope.options.scales.yAxes[0].scaleLabel.displayd = true 
			$scope.options.scales.yAxes[0].scaleLabel.labelString = 
				currentSensor.name+ " ("+currentSensor.output.unit+")";
			$scope.series.push(currentSensor.source)
		}
	})

	$scope.reset();
}]);
