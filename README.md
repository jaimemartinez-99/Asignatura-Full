# ASIGNATURA BLOCKCHAIN
Aplicación blockchain que imita la gestión de una asignatura. Permite matricular, evaluar y gestionar el profesorado de una asignatura. 

Para ejecutar la aplicación se necesita Ganache.

Para desplegar la aplicación se han de seguir los siguientes pasos:
```

  $ cd truffle
  $ npx truffle migrate --reset --compile-all
  $ npx truffle exec scripts/rellenar.js

```


Para lanzar la aplicación web:
  ```

  $ cd dapp
  $ npm install
  $ npm run dev

```
