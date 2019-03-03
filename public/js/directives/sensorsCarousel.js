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

'use strict';
smartHomeApp.directive('sensorsCarousel', function(settings, socket) {

    function link(scope,element) {
        
      scope.settings = settings;
      scope.sensors = [];

      scope.resetSlide = function(slide) {
          
      }

      scope.onCarouselInit =  function() { 
       
      }

      scope.onBeforeChange = function(index) {  

      }

      scope.onAfterChange = function(index) {
        scope.settings.currentSensor = scope.sensors[index]
        socket.emit("selectResource", scope.settings.currentSensor.id)
      }

    

      scope.addSensor = function(sensor) {
        if ( sensor.canvas == null ) {
          var width =  element[0].offsetWidth;
          var containerPadding = parseInt(element.css('padding'))
          var containerHeight = element[0].offsetHeight;
          var height = containerHeight - 2*containerPadding;
          
          var containerWidth = containerHeight + containerPadding/2
          
          element.css("width",containerWidth+"px" )

          if ( sensor.output ) {
            if ( !sensor.output.hasOwnProperty('unit') ) {
              sensor.output.unit = "";
            }

            if ( sensor.output.hasOwnProperty('min') &&  sensor.output.hasOwnProperty('max') ) {
              if ( !sensor.output.hasOwnProperty('threshold') ) {
                sensor.output.threshold = sensor.output.max;
              }
              
              sensor.canvas = new steelseries.Radial( sensor.id,
                                    { 
                                      gaugeType: steelseries.GaugeType.TYPE4,
                                      minValue: sensor.output.min,
                                      maxValue: sensor.output.max,
                                      size: height,
                                      frameDesign: steelseries.FrameDesign.STEEL,
                                      knobStyle: steelseries.KnobStyle.STEEL,
                                      pointerType: steelseries.PointerType.TYPE6,
                                      section: null,
                                      area: null,
                                      titleString: sensor.name,
                                      unitString: "("+sensor.output.unit+")",
                                      threshold: sensor.output.threshold,
                                      lcdVisible: true,
                                      lcdDecimals: 2,
                                      backgroundColor:steelseries.BackgroundColor.ANTHRACITE
                                    });
              
                sensor.ledColor = steelseries.LedColor.GREEN_LED;
            }
          }
        }
      }


      socket.on('add', function(resource) {
        if (resource.type == "sensor") {
          for(var i=0; i<scope.sensors.length; i++) {
            if ( scope.sensors[i].id == resource.id ) {
                return;
            }
          }
          resource.canvas = null;
          resource.index = scope.sensors.length;
          scope.sensors.push(resource);

          setTimeout( function () {
            scope.addSensor(resource)
          }, 100)
        }
      })       
  
      socket.on('data', function(data) {
        if ( scope.settings.currentSensor && 
             scope.settings.currentSensor.id == data.id &&
             scope.settings.currentSensor.canvas ) {
          scope.settings.currentSensor.canvas.setValue(data.value)
        }
      })
    }

    return {
      restrict: 'AE',
      link: link, 
      replace: true,
      templateUrl:  'partials/directives/sensorsCarousel.html'
    };
  
});
