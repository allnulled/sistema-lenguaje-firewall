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
    if ~comprobar_una_cosa() then {
        ~ejecutar_una_cosa()
    }
    else if ~comprobar_otra_cosa() then ~ejecutar_otra_cosa()
    else if ~comprobar_otra_cosa_mas() then ~ejecutar_otra_cosa_mas()
    else ~no_hacer_nada()
}
```

Y así:

```
on event {*} then {
    in process first_process: {
        if ~@comprobar_una_cosa(evento.id, whatever).chainables(1,2,3).more.chainables(whatever).and.also["access via property"].would.be.valid() then {
            do @whatever().also.chainable()
            do @whatever.else().chainable().too()
            stop first_process
        }
    }
    in process second_process: {
        do @whatever.chainable()
        stop second_process
    }
    in process third_process: {
        do @whatever.utils[{{ "chainable this way too using JavaScript directly [and can reuse symbols easily inside]" }}].call({{ this, 500 + 5, "whatever" }})
    }
}
```

```
on event {*} then {
    anytime ~@auth.cargar_autentificacion()
    in process nivel_1: {
        if @auth.tiene_permiso("administrar") or @auth.es_de_grupo("administradores") then stop nivel_1
        if @auth.tiene_ticket_para("administrar") then {
            anytime ~@auth.consumir_ticket_para("administrar")
            stop nivel_1
        }
    }
    in process nivel_2: {
        
    }
}
```

Aquí vemos varias features más:

  [ ] son usables expresiones muy simples de JavaScript:
    [ ] acceder a una variable del ámbito
    [ ] acceder a una propiedad de una variable del ámbito:
      [ ] via propiedad convencional: `@espacio.prop1.prop2`
      [ ] via propiedad usando valor: `@espacio["prop1"]["prop2"]`
      [ ] via propiedad usando valor como string: `@espacio[{{ "prop1" }}][{{ "prop2" }}]`
      [ ] en cadena ilimitada: `@espacio["prop1"].prop2["prop3"].prop4`
    [ ] llamar a un método del ámbito:
      [ ] via propiedad convencional: `@espacio.prop1.prop2.metodo()`
      [ ] via propiedad usando valor: `@espacio["prop1"]["prop2"]["metodo"]()`
      [ ] en cadena ilimitada: `@espacio["prop1"].prop2["prop3"].prop4.metodo()`
      [ ] via propiedad usando valor como string: `@espacio[{{ "prop1" }}][{{ "prop2" }}][{{ "metodo" }}]()`
      [ ] sin parámetros: `@espacio.prop1.prop2.metodo()`
      [ ] con parámetros: `@espacio.prop1.prop2.metodo(1,2,3)`
        [ ] con parámetros a pelo: `@espacio.prop1.prop2.metodo(1,2,3)`
        [ ] con parámetros como string: `@espacio.prop1.prop2.metodo({{ aqui(), mas(), cosas(), son.posibles({ msg: "whatever" }) }})`
    [ ] puede usar llamadas síncronas (normal)
    [ ] puede usar llamadas asíncronas (con `await` delante, usando el `~`)
    