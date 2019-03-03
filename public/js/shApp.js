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

var smartHomeApp = angular.module('smartHomeApp', [ 
                                                      'shDirectives',
                                                      'shControllers',
                                                      'shServices',
                                                      'ngMaterial', 
                                                      'ngMessages', 
                                                      'ngAria',
                                                      'ngAnimate',
                                                      'ui.carousel',
                                                      'ngSanitize',
                                                      'vcRecaptcha',
                                                      'btford.socket-io',
                                                      'chart.js',
                                                      'rzModule'
                                                      ])


       .factory('socket', function (socketFactory) {
              return socketFactory();
       });

