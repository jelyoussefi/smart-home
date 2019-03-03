#!/bin/sh
rm -rf ./steelseries && git clone http://github.com/HanSolo/SteelSeries-Canvas.git steelseries
cd ./steelseries && patch -p0 < ../patches/steelseries.patch && cd ..
cd ./node_modules/angular-ui-carousel/ && patch -p0 < ../../patches/ui-carousel.patch
