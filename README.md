# sistema lenguaje firewall

Centralizar lógica (condicional) entorno a eventos usando un pequeño lenguaje que intercala JavaScript.

## Instalar

```
git clone ...
```

Quizá está en NPM también:

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

El lenguaje capta 1 tipo de sentencia: el registro de eventos. Puede repetirse cuantas veces sean.

Dentro de esta sentencia, podemos encontrar 3 tipos de sentencia:

  - Siempre. Los bloques de siempre siempre se ejecutan. Solo admite bloques de JavaScript.
  - Proceso. Los bloques de procesos pueden interrumpirse con un {{ break nombre_de_proceso; }} de JavaScript. Permiten continuar la sintaxis solamente.
  - Condicional. Los bloques condicionales pueden definir unas condiciones y decidir qué viene después, si más sentencias tipo así, o un bloque de JavaScript a pelo.

Un ejemplo de sentencia de siempre es muy sencillo.

```
siempre {{ console.log("que pasa por aquí, imprimirá esto") }}

anytime {{ console.log("que pasa por aquí, imprimirá esto") }}
```

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