# Etscene #

## Getting Started ##

### Etscene ###

```bash
git clone git@github.com:alekstorm/etscene.git
cd etscene
apt-get install python-virtualenv
virtualenv --no-site-packages .
source bin/activate
```

### JPEG and FreeType2 ###

```bash
sudo aptitude install libjpeg libjpeg-dev
sudo aptitude install libfreetype6 libfreetype6-dev
```
 
### zlib ###

```bash
curl http://zlib.net/zlib-1.2.5.tar.gz | tar xfz -
cd zlib-1.2.5
./configure
make
make install
```

### Vortex ###

```bash
git clone git@github.com:alekstorm/vortex.git
cd vortex
python setup.py install
```

### EaselJS ###

```bash
git clone git@github.com:alekstorm/EaselJS.git
cd EaselJS/build
curl http://closure-compiler.googlecode.com/files/compiler-latest.tar.gz | tar xfz -
./build.bash compiler.jar "--formatting PRETTY_PRINT --formatting PRINT_INPUT_DELIMITER"
cp output/easel.js <etscene-path>/static/js
```

### etsy-tornado ###

```bash
git clone git@github.com:alekstorm/etsy-tornado.git
cd etsy-tornado
python setup.py install
```

### MongoDB ###

```bash
curl http://downloads.mongodb.org/linux/mongodb-linux-(i686|x86_64)-latest.tgz | tar xfz -
mkdir -p <etscene-path>/data/db
<mongodb-path>/bin/mongod --dbpath <etscene-path>/data/db
```

## Configuration ##

Create `etscene/local_settings.py` to override site-specific settings, including
ports and the Etsy API key. Defaults are in `etscene/settings.py`.

## Starting ##

To start the server:

```bash
script/start
```
