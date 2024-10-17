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

// 2. Cargar o escuchar fichero:
const ruta =__dirname + "/firewall.fwl";
firewall.cargar_fichero(ruta);
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