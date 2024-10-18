[VIERNES 18/10/2024]
  [x]
  
Otra cosa a tener en cuenta es que si al crear el Firewall le pasas algo así:

```js
const firewall = Firewall.crear({
    globales: {
        nombre_de_funcion() {
            // Código de función
        },
        comprobar_una_cosa() {},
        comprobar_otra_cosa() {},
        comprobar_otra_cosa_mas() {},
        ejecutar_una_cosa() {},
        ejecutar_otra_cosa() {},
        ejecutar_otra_cosa_mas() {},
        no_hacer_nada() {}
    }
});
```

...entonces consigues tener `nombre_de_funcion` como variable del ámbito. Y puedes hacer cosas así:

```
on event {*} then {
    if {{ comprobar_una_cosa() }} then {{ ejecutar_una_cosa() }}
    else if {{ comprobar_otra_cosa() }} then {{ ejecutar_otra_cosa() }}
    else if {{ comprobar_otra_cosa_mas() }} then {{ ejecutar_otra_cosa_mas() }}
    else {{ no_hacer_nada() }}
}
```

Y al final de hoy, tendríamos que poder hacerlo así también:

```
on event {*} then {
    if comprobar_una_cosa() then ejecutar_una_cosa()
    else if comprobar_otra_cosa() then ejecutar_otra_cosa()
    else if comprobar_otra_cosa_mas() then ejecutar_otra_cosa_mas()
    else no_hacer_nada()
}
```