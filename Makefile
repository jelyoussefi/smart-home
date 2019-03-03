#
# Copyright (c) 2018 Intel Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#


#----------------------------------------------------------------------------------------------------------------------
# targets
#----------------------------------------------------------------------------------------------------------------------

SHELL:=/bin/bash
CUR_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))


all: install start


install:
	@$(call msg,"Installing prerequisites ...");
	@apt -qq list nodejs 2> /dev/null| grep -q "\[installed\]$$" ||  /bin/bash -c "\
		curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - && \
		sudo apt-get install -y nodejs"

	@sudo apt-get install -y build-essential > /dev/null
	@sudo apt-get install -y ssh > /dev/null
	@sudo apt-get install -y libzmq-dev > /dev/null

	@cd ${CUR_DIR}/public/lib && npm install --prefix=./
	@cd ${CUR_DIR} && npm install --prefix=./

start: stop
	@$(call msg,"Starting the smart home server ...");
	@/bin/bash -c 'node ./server.js & echo $$! > server.PID'


stop: 
	@if [ -e server.PID ]; then \
		$(call msg,"Stopping the smart home server ..."); \
    	kill -9 $$(cat server.PID); \
    	rm -rf server.PID; \
	fi;


#----------------------------------------------------------------------------------------------------------------------
# helper functions
#----------------------------------------------------------------------------------------------------------------------

define msg
	tput setaf 2 && \
	for i in $(shell seq 1 120 ); do echo -n "-"; done; echo "" && \
	echo -e "\t"$1 && \
	for i in $(shell seq 1 120 ); do echo -n "-"; done; echo "" && \
	tput sgr0
endef
