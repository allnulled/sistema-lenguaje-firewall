const parser = require(__dirname + "/sistema_lenguaje_firewall.parser.js");

const Sistema_lenguaje_firewall = class {
  static crear(...args) {
    return new this(...args);
  }
  constructor(configuraciones = {}) {
    this.fichero = undefined;
    this.estado = {};
    this.eventos = {};
    this.configuraciones = Object.assign({
      tracear: true,
      ambito: this,
      separador_de_eventos: ";",
      separador_de_ambito: "."
    }, configuraciones);
  }
  tracear(mensaje) {
    if(this.configuraciones.tracear) {
      console.log("[TRACE] [firewall] " + mensaje);
    }
  }
  interpretar_script(texto) {
    this.tracear("Firewall.prototype.interpretar_script");
    return parser.parse(texto);
  }
  cargar_script(texto) {
    this.tracear("Firewall.prototype.cargar_script");
    // Reseteamos el estado:
    this.estado = this.interpretar_script(texto);
    // Reseteamos los eventos:
    this.eventos = {};
    for(let index_sentencia=0; index_sentencia<this.estado.ast.length; index_sentencia++) {
      const sentencia = this.estado.ast[index_sentencia];
      const eventos = sentencia.eventos.split(this.configuraciones.separador_de_eventos);
      for(let index_evento=0; index_evento<eventos.length; index_evento++) {
        const evento = eventos[index_evento];
        this.registrar(evento, this.crear_funcion_asincrona_por_codigo(sentencia.bloque, ["evento", "parametros", "firewall"]))
      }
    }
    return this.estado;
  }
  crear_funcion_asincrona_por_codigo(codigo_js, nombres_de_parametros = []) {
    this.tracear("Firewall.prototype.crear_funcion_asincrona_por_codigo");
    let precodigo_js = "";
    for(let index=0; index<nombres_de_parametros.length; index++) {
      const nombre = nombres_de_parametros[index];
      precodigo_js += "const " + nombre + " = arguments[" + index + "];\n";
    }
    const codigo_funcion = precodigo_js + codigo_js;
    return Object.getPrototypeOf(async function() {}).constructor(codigo_funcion);
  }
  leer_fichero(ruta) {
    this.tracear("Firewall.prototype.leer_fichero");
    return new Promise((resolve, reject) => {
      require("fs").readFile(ruta, "utf8", function(error, contents) {
        if(error) {
          return reject(error);
        }
        return resolve(contents);
      });
    });
  }
  cargar_fichero(ruta) {
    this.tracear("Firewall.prototype.cargar_fichero");
    console.log(ruta);
    // Cargamos el fichero:
    return this.leer_fichero(ruta).then(contenido => {
      // Fijamos el fichero:
      this.fichero = ruta;
      return this.cargar_script(contenido);
    });
  }
  escuchar_fichero(ruta) {
    this.tracear("Firewall.prototype.escuchar_fichero");
    return require("chokidar").watch(ruta).on('all', (event, path) => {
      this.cargar_fichero(ruta);
    });
  }
  registrar(id_brute, evento) {
    this.tracear("Firewall.prototype.registrar");
    const id = id_brute.trim();
    if(!(id in this.eventos)) {
      this.eventos[id] = [];
    }
    this.eventos[id].push(evento);
  }
  async emitir(id, parametros) {
    this.tracear("Firewall.prototype.emitir");
    let id_partido = id.split(this.configuraciones.separador_de_ambito);
    let todos_los_eventos = [];
    let contador = 0;
    Coleccionar_eventos_del_hilo: {
      while(id_partido.length !== 0) {
        contador++;
        const id_en_texto = id_partido.join(this.configuraciones.separador_de_ambito);
        const eventos = this.obtener_eventos(id_en_texto, contador !== 1);
        todos_los_eventos = todos_los_eventos.concat(eventos);
        id_partido.pop();
        if(id_partido.length === 0) {
          const eventos = this.obtener_eventos("*", false);
          todos_los_eventos = todos_los_eventos.concat(eventos);
          break Coleccionar_eventos_del_hilo;
        }
      };
    }
    const salida = [];
    for(let index_evento=0; index_evento<todos_los_eventos.length; index_evento++) {
      const evento = todos_los_eventos[index_evento];
      const resultado = await evento.call(this.configuraciones.ambito, id, parametros, this);
      salida.push(resultado);
    }
    return salida;
  }
  obtener_eventos(id, tambien_asterisco = true) {
    this.tracear("Firewall.prototype.obtener_eventos");
    let eventos = [];
    Obtener_eventos_match: {
      if(id in this.eventos) {
        const eventos_1 = this.eventos[id];
        eventos = eventos.concat(eventos_1);
      }
    }
    Obtener_eventos_con_asterisvo: {
      if(!id.endsWith("*") && tambien_asterisco) {
        const id_2 = id + ".*";
        if(id_2 in this.eventos) {
          const eventos_2 = this.eventos[id_2];
          eventos = eventos.concat(eventos_2);
        }
      }
    }
    Devolver_eventos_obtenidos: {
      return eventos;
    }
  }
}

module.exports = Sistema_lenguaje_firewall;