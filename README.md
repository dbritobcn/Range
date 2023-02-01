# Range

Componente Range para React

## Para empezar

Para arrancar el proyecto, debemos instalar las dependencias con el comando `npm install`.\
Es importante usar `node v16+` para no tener problemas de compatibilidad al lanzar los test.

## Scripts disponibles

### `npm start`

Usamos este comando para arrancar el proyecto bajo un entorno de desarrollo. Esto nos habilitará el enlace [http://localhost:8080](http://localhost:8080).

La página se volverá a cargar cuando realicemos cambios.
También podremos ver los errores y warnings del linter en la consola.

### `npm test`

Lanza el test runner de `jest`.

### `npm run e2e`

Lanza el test runner para poder ejecutar los test E2E de `Cypress`.\

### `npm run build`

Construye la aplicación para producción en la carpeta `public`.\
Empaqueta React en modo de producción y optimiza la compilación para obtener el mejor rendimiento.

La compilación se minimiza y los nombres de archivo incluyen los hashes.

### `npm run lint`

Ejecuta el linter.

## API

En modo desarrollo, se interceptan las llamadas a la API mediante [Mock Service Worker](https://mswjs.io/).
