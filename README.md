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
    precargas: [],
}
```




### La propiedad `this.configuraciones.separador_de_ambito`

El separador de ámbito es un texto que se usa para separar los ámbitos de un identificador de eventos. Así, decimos que el evento `rest.actualizar.muchos` tiene 3 ámbitos: `rest`, `actualizar`, y `muchos`. Esto permite el juego del `*` (asterisco) para seleccionar eventos, como hemos explicado antes.

Se usa en la sentencia de registrar eventos así:

```
on events {
    rest.insertar.muchos,
    rest.insertar.muchos.*,
    rest.actualizar.muchos,
    rest.actualizar.muchos.*,
    rest.eliminar.muchos,
    rest.eliminar.muchos.*,
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

### La propiedad `this.configuraciones.precargas`

Esta propiedad permite especificar una lista de rutas de ficheros que quieres que se usen cuando hagas:

```js
await firewall.precargar_estado();
```

Que es una llamada implicada en la función:

```js
await firewall.cargar_fichero(ruta);
```

Aunque no será llamada si usas el segundo parámetro así:

```js
await firewall.cargar_fichero(ruta, { precargar: false }); // Por defecto está en true en «cargar_fichero»
```

Esta propiedad no está implicada en la llamada:

```js
firewall.cargar_script(texto);
```

Esto se debe a que al `precargar_estado` se rompería la sincronía del método `cargar_script`, y no es deseable. Si quieres usar la precarga en combinación con `cargar_script`, puedes usarlo por tu cuenta combinándolo con el método `precargar_estado` que, a diferencia de `cargar_script`, es asíncrono.

Ten en cuenta que los eventos de la precarga se incrustarán en `firewall.eventos` pero el `firewall.estado` no mostrará el AST (Abstract Syntax Tree) de ninguno de esos ficheros, sino del último fichero que es el que usas cuando llamas a `firewall.cargar_fichero(este_fichero_digo)`.


### La API más en profundidad

Principalmente, la API se usa así:

```js
const firewall = require("sistema-lenguaje-firewall").crear({ precargas: ["auth.fwl"] });
await firewall.cargar_fichero("custom.fwl");
await firewall.emitir("evento", "parametros");
```

Aquí, en 3 líneas, estarías preparando lógica fija (precargas), lógica variable (custom.fwl) y emitiendo un evento ya.

Pero hay más usos que pueden interesarte, sin meterse dentro de la API de "bajo nivel" de la librería, que son más como utilidades que usa la de "alto nivel".

Y esto es lo que querría explicar en esta sección.

#### Crear una regla en vivo con la API

Puedes crear nuevas reglas para el firewall sin dejar de usarlo así:

```js
await firewall.insertar_regla(codigo); // usará la ruta del último fichero cargado
await firewall.insertar_regla(codigo, fichero); // usará la ruta proporcionada en fichero
```

Esto hará que:
  1. Lea el fichero
  2. Interprete el fichero
  3. Cambie el código
    - Para añadir la regla en este caso
  4. Sobreescriba el fichero
  5. Resetee el estado y los eventos del firewall
  6. Precargue los ficheros (recuerda: de `firewall.configuraciones.precargas`)
  7. Cargue nuevamente el fichero

Y así actualice su estado en función de los cambios aplicados.

#### Cambiar una regla en vivo con la API

Puedes cambiar reglas del firewall sin dejar de usarlo así:

```js
await firewall.cambiar_regla(id_de_regla, codigo); // usará la ruta del último fichero cargado
await firewall.cambiar_regla(id_de_regla, codigo, fichero); // usará la ruta proporcionada en fichero
```

Esto hará que:
  1. Lea el fichero
  2. Interprete el fichero
  3. Cambie el código
    - Para cambiar la regla en este caso
  4. Sobreescriba el fichero
  5. Resetee el estado y los eventos del firewall
  6. Precargue los ficheros (recuerda: de `firewall.configuraciones.precargas`)
  7. Cargue nuevamente el fichero

Y así actualice su estado en función de los cambios aplicados.

#### Eliminar una regla en vivo con la API

Puedes eliminar reglas para el firewall sin dejar de usarlo así:

```js
await firewall.eliminar_regla(codigo); // usará la ruta del último fichero cargado
await firewall.eliminar_regla(codigo, fichero); // usará la ruta proporcionada en fichero
```

Esto hará que:
  1. Lea el fichero
  2. Interprete el fichero
  3. Cambie el código
    - Para eliminar la regla en este caso
  4. Sobreescriba el fichero
  5. Resetee el estado y los eventos del firewall
  6. Precargue los ficheros (recuerda: de `firewall.configuraciones.precargas`)
  7. Cargue nuevamente el fichero

Y así actualice su estado en función de los cambios aplicados.

#### Recargar el firewall

Para recargar todo: las precargas y el fichero interactuable (mediante estos métodos, que acabo de explicar, de: `insertar_regla`, `cambiar_regla`, `eliminar_regla`), hay un método al uso, usa asincronía porque tiene que leer ficheros, en teoría:

```js
await firewall.recargar();
```

Tienes que haber hecho antes esto para que funcione:

```js
await firewall.cargar_fichero("firewall.fwl");
```

#### Vincular un fichero al firewall

Para sincronizar el estado de un fichero automáticamente con el firewall, lo cual no siempre es la mejor opción (es menos costoso `firewall.recargar()` y ya), puedes usar este método, que por debajo usa la librería `chokidar`:

```js
firewall.escuchar_fichero(fichero);
```

De esta forma, si cambias el fichero, y el código está bien formado, se cambia el estado del firewall automáticamente.

## Conclusiones

Esta librería y lenguaje surge por la demanda de **aliviar tensión** en un punto crítico de muchas aplicaciones.

La lógica de negocio, cuando las cosas se empiezan a complicar, se vuelve un punto oscuro, donde pasan muchas cosas, pero no sabes, todo está junto, con código. 

Esta librería INVITA y FACILITA buenas prácticas a la hora de desarrollar esta lógica de negocio:
  
  - **Mayor desacoplamiento de código**. Al interesar tener las funciones separadas y accesibles, el lenguaje invita a que separes y definas claramente el código que quieres implicar en esta centralización de la lógica (de seguridad sobre todo, por cierto, enfocado a eso sobre todo, por eso lo he llamado *firewall* aunque puede usarse para muchas cosas más). El juego de las globales, por ejemplo, ya invita a que separes el código que quieres implicar en esta lógica.
  - **Mayor desacoplamiento entre causas (condiciones) y consecuencias (instrucciones)**. Al solo disponer de sentencias escasas, el lenguaje ya invita a que utilices condicionales y procesos interrumpibles para guiar al flujo de ejecución por donde interesa en la aplicación. Esto invita a su vez a romper la lógica de negocio en 2 categorías: condiciones (*ifs*) e instrucciones (*thens*).
  - **Mayor granularidad**. Este desacoplamiento trae consigo la ventaja de granular más el código, y así reaprovechar el código de condiciones e instrucciones para otras ocasiones.
  - **Mayor claridad del código**. Cuando entras en un script así, ya sabes qué tipo de lógica vas a encontrar. Y eso permite que puedas usar un lenguaje que aporta mayor claridad al expresar las intenciones que tienes para con el programa. Por eso surge el lenguaje, esta es la principal razón por la que lo construí.
  - **Menor ofuscación del código**. Si te fijas, es una sintaxis muy seca. Podría permitir muchísimas más cosas, podría ampliarse a lenguaje de propósito general. Pero esto permitiría que la ofuscación del código proliferase. De esta forma, nos centramos en lo que interesa, y apartamos lo que no.
  - **Mayor organización**. Con esto va a estar tirado localizar la lógica de la seguridad, buscar en ella, y encontrar rápidamente los fallos de seguridad.
  - **Seguridad más asequible**. No es lo mismo tener un sistema de condicionales esparcido por todo el proyecto, que tener la lógica sensible centralizada en 1 solo sitio. Esto permite conseguir seguridad más fácilmente, así como llegar más lejos, sin tanta complejidad que luego además te quitará tiempo.

El proyecto es muy parecido a otros que he hecho, del tipo *gestor de hooks*. La diferencia de este es que ya lo he orientado a clarificar condicionales intrincados que puedan complicar la lógica de seguridad sobre todo, donde tienes que tener en cuenta permisos y cosas así.

Me gusta enfocarlo como una máquina que va a facilitar que puedas utilizar sistemas de autorización, permisos y seguridad así, de una forma ya más o menos guiada, pero sin quitarle potencial práctico tampoco. Tú preparas esa máquina (con funciones, las globales), cargas el estado (con texto) o vinculas el estado (a un fichero), y de ahí utilizas la máquina para dispersar la lógica de seguridad por tu programa. De esta forma, te puedes olvidar bastante del tema, porque por un lado solo tienes que inyectar emisiones de eventos, y por el otro lado aclarar las reglas lógicas en 1 script.

Insisto, tener todas las condiciones de la lógica de seguridad centralizadas, con una sintaxis específica que permite clarificar y legibilizar todo. Y creo que se ha conseguido, JavaScript puede leerse bien, pero es mucho mejor tenerlo separado, con una lógica aparte, en un lenguaje aparte. Esto, calculo, hará que puedas escalar más fácilmente programas que necesitan incorporar seguridad.

Y ya está, es todo.
