# sistema lenguaje firewall

Centralizar lógica (condicional) entorno a eventos usando un pequeño lenguaje que intercala JavaScript.

## Sitios oficiales

 - Github: [https://github.com/allnulled/sistema-lenguaje-firewall](https://github.com/allnulled/sistema-lenguaje-firewall)
 - NPM: [https://www.npmjs.com/package/sistema-lenguaje-firewall](https://www.npmjs.com/package/sistema-lenguaje-firewall)

## Instalar

Puedes bajártelo con git así:

```
git clone https://github.com/allnulled/sistema-lenguaje-firewall.git .
```

También puedes descargártelo mediante npm así:

```
npm install -s sistema-lenguaje-firewall
```

## Uso

Para usar la librería:

```js
// 1. Crear el firewall:
const firewall = require("sistema-lenguaje-firewall").crear();

// 2. Cargar y/o escuchar fichero:
const ruta =__dirname + "/firewall.fwl";
await firewall.cargar_fichero(ruta);
firewall.escuchar_fichero(ruta);

// 3. Emitir eventos:
await firewall.emitir("evento.id", "parametros");
```

## Lenguaje

El script que centraliza esta lógica sigue su propia sintaxis. He aquí algunos ejemplos de uso:

```
[ rule 87 ]
on event { * } then {
    anytime [[ // load_everything() ]]
    if not [[ true ]] or [[ false ]] and (
        ([[ false ]] or [[ false ]]) or
        ([[ false ]] or [[ true ]])
    ) then [[ 
        // await go();
    ]]
    if [[ false ]] or [[ false ]] and (
        [[ false ]] or [[ false ]]
    ) then [[ 
        // await go();
    ]]
}
```

Puedes usar la sintaxis en castellano:

```
[ Regla X ]
en evento { * } entonces {
    siempre [[ // cargar_todo() ]]
    si no [[ true ]] o [[ false ]] y (
        ([[ false ]] o [[ false ]]) o
        ([[ false ]] o [[ true ]])
    ) entonces [[ 
        // await go();
    ]]
    si [[ false ]] o [[ false ]] y (
        [[ false ]] o [[ false ]]
    ) entonces [[ 
        // await go();
    ]]
}
```

O puedes usar otras sintaxis para los textos:

```
on event { * } then {
    anytime {{ // await cargar_todas_las_cosaj() }}
    if (not {{ true }} and not {{ true }} and {{ false }}) then {{
        // stay_high()
    }}
}

on event { * } then {
    anytime {{ }}
}

on event { * } then {{ // load_everything() }}

on event { * } then {{
    console.clear();
    console.log("[TRACE] A las " + (new Date()).toString() + "\n[TRACE] Evento emitido: " + evento);
    console.log("[TRACE]", parametros);
}}
```

Puedes usar también otros contenedores de JavaScript/texto como:
  - `@{` y `}`
  - `{{` y `}}`
  - `{{{` y `}}}`
  - `{{{{` y `}}}}`
  - `[:` y `:]`
  - `[[` y `]]`
  - `[[[` y `]]]`
  - `[[[[` y `]]]]`

Se reserva el uso de `{` y `}` para los bloques `then/entonces` que continúen la sintaxis propia del firewall (no JavaScript, vamos).

Los selectores permiten que:
  - Mientras que `insertar` no será llamado al `insertar.muchos` o `insertar.uno`.
  - Ocurre que `insertar.*` sí será llamado al `insertar.muchos` o `insertar.uno`.

Pero en esencia, se trata de:
  - Crear una máquina firewall
  - Cargarla/Vincularla con un script en `*.fwl`
  - Esparcir emisiones de eventos por toda la aplicación

Lo que se consigue de esta manera es, repito:
  - CENTRALIZAR la lógica más sensible de la aplicación
  - ORGANIZARLA según eventos para un uso eficiente
    - no tener miles de eventos juntos, sin orden ni criterio
    - no tener que procesar un script para saber qué hacer de nuevas todo el rato
  - CLARIFICAR un punto crítico en muchas aplicaciones
    - ...me refiero a la "lógica de negocio".
  - PERMITIR LA MANIPULACIÓN del script de negocio
    - Con operaciones mágicas del firewall
    - Usando las referencias que se pueden aprovechar del lenguaje

No son muchas ventajas, pero alguna de ellas puede aumentar la mantenibilidad de forma crítica, como centralizar la lógica sensible y clarificar la información.

## Detalles del lenguaje

El lenguaje acepta sentencias, como todos los lenguajes.

### Sentencias globales

El lenguaje capta 1 tipo de sentencia: el registro de eventos. Puede repetirse cuantas veces sean.

### Sentencias de «registro de eventos»

Este, por ejemplo, es el evento genérico. Si usamos el `*`, estaremos inyectando código en todos los eventos de la máquina.

```
[ rule whatever ]
on event { * } then {
    
}
```

El título `rule whatever` te será una útil referencia para más adelante, en usos avanzados de la máquina. De momento, es un simple nombre que se le puede dar a ese evento. Pero es totalmente opcional y ahorrable.

Hay otros detalles sobre los identificadores de eventos:

  - Tienen espacios de nombre. Por defecto es `.`. Todos están separados por el caracter que hay en `firewall.configuraciones.separador_de_ambito`. Por defecto, es `.`.
    - Los espacios de nombres permiten jugar con el asterisco en los selectores.
    - Por ejemplo, si vas a hacer una API, puedes prefijarla con un nombre, y lanzar eventos en toda la API solo con: `miapi.*`
  - Tienen separador de eventos. Por defecto es `,`. Está en `firewall.configuraciones.separador_de_eventos`. Con esto, puedes crear reglas que apunten a varios eventos a la vez. Por ejemplo:

```
on events {
    rest.insert.many,
    rest.update.many,
    rest.delete.many
} then {
    
}
```

En este ejemplo se está apuntando a varios selectores al mismo tiempo, y es correcto.

Pues dentro de esta sentencia, podemos encontrar 3 tipos de sentencia:

  - Siempre. Los bloques de siempre siempre se ejecutan. Solo admite bloques de JavaScript.
  - Proceso. Los bloques de procesos pueden interrumpirse con un {{ break nombre_de_proceso; }} de JavaScript. Permiten continuar la sintaxis solamente.
  - Condicional. Los bloques condicionales pueden definir unas condiciones y decidir qué viene después, si más sentencias tipo así, o un bloque de JavaScript a pelo.

### Sentencia de «siempre»

Un ejemplo de sentencia de siempre es muy sencillo.

```
siempre {{ console.log("que pasa por aquí, imprimirá esto") }}

anytime {{ console.log("que pasa por aquí, imprimirá esto") }}
```

### Sentencia de «en proceso»

Un ejemplo de sentencia de proceso es muy sencillo.

```
en proceso x: {
    siempre {{ console.log("Empieza proceso x") }}
    siempre {{ break x; }}
}

in process y: {
    siempre {{ console.log("Starts process y") }}
    siempre {{ break y; }}
}
```

### Sentencia de «condicional»

Un ejemplo de sentencia de condicional podría ser este:

```
si {{ condicion(1) }} y {{ condicion(2) }} o (
    {{ condicion(3) }} y {{ condicion(4) }}
) entonces {{
    console.log("OK 1")
}} o si ({{ condicion(5) }} o {{ condicion(6) }}) y (
    {{ condicion(7) }} o {{ condicion(8) }}
) entonces {{
    console.log("OK 2")
}} o si no entonces {{
    console.log("NO OK");
}}

if {{ condicion(1) }} and {{ condicion(2) }} or (
    {{ condicion(3) }} and {{ condicion(4) }}
) then {{
    console.log("OK 1")
}} o si ({{ condicion(5) }} o {{ condicion(6) }}) y (
    {{ condicion(7) }} o {{ condicion(8) }}
) entonces {{
    console.log("OK 2")
}} o si no entonces {{
    console.log("NO OK");
}}
```

Piensa que el entonces puedes continuarlo con bloques de JavaScript o con sintaxis normal. Por ejemplo:

```
if {{ condicion(1) }} then {
    in process one: {
        if {{ condicion(2) }} or {{ condicion(3) }} or {{ condicion(4) }} then {
            anytime {{ break one; }}
        } else if {{ condicion(5) }} or {{ condicion(6) }} then {
            anytime {{ break one; }}
        } else {
            anytime {{ throw new Error("No se puede"); }}
        }
    }
}
```

## La API

En esta sección se detalla información sobre la API.

### El constructor `Firewall.crear(configuraciones)`

Cuando importamos la API, nos devuelve una clase: `Firewall`.

```js
const Firewall = require("sistema-lenguaje-firewall");
```

Para crear instancias con esa clase, podemos usar el método estático `Firewall.crear(configuraciones)`.

```js
Firewall.crear({
    // Aquí van las configuraciones.
})
```

El parámetro `configuraciones` que se le pasa, este objeto, puede sobreescribir el estado por defecto de las configuraciones.

Este es el estado por defecto de las configuraciones:

```js
{
    tracear: true,
    ambito: this,
    separador_de_eventos: ",",
    separador_de_ambito: ".",
    globales: {},
}
```




### La propiedad `this.configuraciones.separador_de_ambito`

El separador de ámbito es un texto que se usa para separar los ámbitos de un identificador de eventos. Así, decimos que el evento `rest.actualizar.muchos` tiene 3 ámbitos: `rest`, `actualizar`, y `muchos`. Esto permite el juego del `*` (asterisco) para seleccionar eventos, como hemos explicado antes.

Se usa en la sentencia de registrar eventos así:

```
on events {
    rest,
    rest.*,
    rest.actualizar,
    rest.actualizar.*,
    rest.actualizar.muchos,
    rest.actualizar.muchos.*,
} then {

}
```

Por defecto es `.` (un punto).

### La propiedad `this.configuraciones.separador_de_evento`

El separador de eventos es un texto que se usa para separar los eventos de un identificador de eventos. Así, por ejemplo, podemos referirnos a diferentes eventos en una misma regla. El ejemplo anterior de `this.configuraciones.separador_de_ambito` es suficientemente ilustrativo.

Por defecto es `,` (una coma).

### La propiedad `this.configuraciones.tracear`

Esta propiedad es un booleano que indica si se tienen que imprimir los traceos o no.

Por defecto es `true`.

### La propiedad `this.configuraciones.ambito`

Esta propiedad es usada para hacer `funcion_de_evento.bind(this.configuraciones.ambito)` con todos los eventos que registremos en el firewall.

Por defecto es `this` (la instancia de `firewall` misma).

Por tanto, todos los eventos encontrarán en el `this` a la instancia de `firewall` por defecto.

### La propiedad `this.configuraciones.globales`

Otra cosa a tener en cuenta es que si al crear el Firewall le pasas algo así en la propiedad de `globales`:

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

...entonces consigues tener `nombre_de_funcion` y las otras como variables del ámbito en el que se ejecuta el evento. No polucionan el espacio global de nombres, pero sí son extraídas del objeto `this.configuraciones.globales` y desacopladas de él en código. Esto significa que en este objeto `globales` no deben ir nombres de propiedades que no puedan ser usadas como nombre de variable en JavaScript. Y si lo haces bien, luego puedes hacer cosas así:

```
on event {*} then {
    if {{ comprobar_una_cosa() }} then {{ ejecutar_una_cosa() }}
    else if {{ comprobar_otra_cosa() }} then {{ ejecutar_otra_cosa() }}
    else if {{ comprobar_otra_cosa_mas() }} then {{ ejecutar_otra_cosa_mas() }}
    else {{ no_hacer_nada() }}
}
```