# forecast
[![Build Status](https://img.shields.io/travis/YerkoPalma/forecast/master.svg?style=flat-square)](https://travis-ci.org/YerkoPalma/forecast) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> monitoreo de horario nacional e internacional

## Features

- [x] Obtener hora y temperatura actual
- [x] Mostrar en pantalla completa los datos
- [x] Obtener datos de una ciudad
  - hora
  - latitud
  - longitud
- [x] Agregar probabilidad de error de 10%
- [x] Guardar errores en redis
- [x] Guardar en redis latitud y longitud de cada ciudad
- [x] Actualizar frontend cada 10 segundos con websockets
- [x] Publicar en Heroku

## API

- GET  /api/ciudades
- GET  /api/ciudades/:ciudad
- POST /api/ciudades
- PUT  /api/ciudades/:ciudad (opcional)

## Arquitectura

Request -> Redis -> forecast.io -> Response

## Instalación

Primero instalar redis.

### Windows

Descargar el ejecutable de redis en el siguiente enlace: https://github.com/dmajkic/redis/downloadsl Luego descomprimir y buscar el archivo `redis_server.exe` y ejecutarlo para correr el servidor de redis

### Unix

Seguir las [instrucciones oficiales](https://redis.io/topics/quickstart)

```bash
$ wget http://download.redis.io/redis-stable.tar.gz
$ tar xvzf redis-stable.tar.gz
$ cd redis-stable
$ make
```

Luego correr el servidor

```bash
$ redis-server
```

Con el servidor de redis listo, installar los archivos del proyecto

```bash
$ git clone https://github.com/YerkoPalma/forecast.git
$ cd forecast
$ npm install
```

Luego, actualizar el cliente

```bash
$ npm run build
```

Antes de poder correr el servidor es necesario configurar una variable de ambiento con el id del servicio de tiempo. Se puede obtener en la siguiente url: https://darksky.net/dev/account

Una vez obtenida la api key configurar en la variable de ambiente `API_KEY`

Finalmente, correr el servidor

```bash
$ npm start
```

## License
[MIT](/license)
