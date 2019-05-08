# forecast
[![Build Status](https://img.shields.io/travis/YerkoPalma/forecast/master.svg?style=flat-square)](https://travis-ci.org/YerkoPalma/forecast) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> monitoreo de horario nacional e internacional

## TODO

- [ ] Obtener hora y temperatura actual
- [ ] Mostrar en pantalla completa los datos
- [ ] Obtener datos de una ciudad
  - hora
  - latitud
  - longitud
- [ ] Agregar probabilidad de error de 10%
- [ ] Guardar errores en redis
- [ ] Guardar en redis latitud y longitud de cada ciudad
- [ ] Actualizar fronend cada 10 segundos con websockets
- [ ] Publicar en Heroku

## API

- GET  /api/ciudades
- GET  /api/ciudades/:ciudad/info
- POST /api/ciudades
- PUT  /api/ciudades/:ciudad (opcional)

## Arquitectura

Request -> Redis -> forecast.io -> Response

## Redis Store

- ciudades -> [`CL`, `CH`, `NZ`, `AU`, `UK`, 'USA']

## License
[MIT](/license)
