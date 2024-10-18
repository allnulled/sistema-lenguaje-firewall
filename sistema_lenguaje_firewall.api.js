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
      separador_de_eventos: ",",
      separador_de_ambito: ".",
      globales: {},
      // Aquí puedes dejar rutas de ficheros que quieres precargar cuando cargas un fichero:
      precargas: [],
    }, configuraciones);
  }
  establecer_globales(globales = {}) {
    this.configuraciones.globales = globales;
    return this;
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
    // Reseteamos el estado (solo almacena el último script):
    this.estado = this.interpretar_script(texto);
    for(let index_sentencia=0; index_sentencia<this.estado.ast.length; index_sentencia++) {
      const sentencia = this.estado.ast[index_sentencia];
      const eventos = sentencia.eventos.split(this.configuraciones.separador_de_eventos);
      for(let index_evento=0; index_evento<eventos.length; index_evento++) {
        const evento = eventos[index_evento];
        this.registrar(evento, this.crear_funcion_asincrona_por_codigo(sentencia.bloque, ["evento", "parametros", "firewall"], this.configuraciones.globales))
      }
    }
    return this.estado;
  }
  async precargar_estado() {
    this.tracear("Firewall.prototype.precargar_estado");
    this.eventos = {};
    const precargas = this.configuraciones.precargas;
    for(let index=0; index<precargas.length; index++) {
      const ruta_precarga = precargas[index];
      const auth_fwl_contenido = await this.leer_fichero(ruta_precarga);
      this.cargar_script(auth_fwl_contenido);
    }
  }
  crear_funcion_asincrona_por_codigo(codigo_js, nombres_de_parametros = [], globales = {}) {
    this.tracear("Firewall.prototype.crear_funcion_asincrona_por_codigo");
    let precodigo_js_parametros = "";
    Iteramos_nombres_de_parametros:
    for(let index=0; index<nombres_de_parametros.length; index++) {
      const nombre = nombres_de_parametros[index];
      precodigo_js_parametros += "const " + nombre + " = arguments[" + index + "];\n";
    }
    const nombres_globales = Object.keys(globales);
    let precodigo_js_globales = "";
    Iteramos_propiedades_globales:
    if(nombres_globales.length) {
      precodigo_js_globales += "const {\n  ";
      for(let index=0; index<nombres_globales.length; index++) {
        const nombre_global = nombres_globales[index];
        if(index !== 0) {
          precodigo_js_globales += ",\n  ";
        }
        precodigo_js_globales += nombre_global;
      }
      precodigo_js_globales += "\n} = firewall.configuraciones.globales;\n";
    }
    const codigo_funcion = precodigo_js_parametros + precodigo_js_globales + codigo_js;
    this.tracear("Compilando JavaScript: " + codigo_funcion);
    const dato_funcion = Object.getPrototypeOf(async function() {}).constructor(codigo_funcion);
    return dato_funcion;
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
  escribir_fichero(ruta, contenido) {
    this.tracear("Firewall.prototype.leer_fichero");
    return new Promise((resolve, reject) => {
      require("fs").writeFile(ruta, contenido, "utf8", function(error, contents) {
        if(error) {
          return reject(error);
        }
        return resolve(contents);
      });
    });
  }
  recargar() {
    return this.cargar_fichero(this.fichero, { precargar: true });
  }
  async cargar_fichero(ruta, opciones_de_carga_arg = {}) {
    this.tracear("Firewall.prototype.cargar_fichero");
    try {
      // Realizamos la precarga, de haberla:
      const opciones_de_carga = Object.assign({
        precargar: true
      }, opciones_de_carga_arg);
      if(opciones_de_carga.precargar) {
        await this.precargar_estado();
      }
      // Leemos el fichero:
      this.tracear("Cargando fichero:\n  - " + ruta);
      const contenido = await this.leer_fichero(ruta);
      // Fijamos el fichero:
      this.fichero = ruta;
      // Cargamos el contenido preservando los eventos previos para que la precarga pueda fijar sus eventos propios:
      return this.cargar_script(contenido);
    } catch (error) {
      console.log("Error al cargar el fichero: " + ruta);
      throw error;
    }
  }
  escuchar_fichero(ruta) {
    this.tracear("Firewall.prototype.escuchar_fichero");
    return require("chokidar").watch(ruta).on('all', (event, path) => {
      this.recargar();
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
  lanzar_error_si_id_en_ast(ast_inicial, ast_regla, lanzar_si_no_existe = false) {
    if(!ast_regla.ast.length) {
      throw new Error("El script de nueva regla de evento no tiene ningún regla de evento");
    } else if(ast_regla.ast.length > 1) {
      throw new Error("El script de nueva regla de evento solo puede tener 1 regla de evento, no más (" + ast_regla.ast.length + " en este caso)");
    }
    const dato_regla = ast_regla.ast[0];
    Comprobar_que_la_regla_tiene_id: {
      if(!dato_regla.id) {
        throw new Error("La regla de evento única del script siempre debe llevar «id»");
      }
    }
    let indice = -1;
    const reglas_con_mismo_id = ast_inicial.ast.filter((regla, indice_regla) => {
      const coinciden = regla.id === dato_regla.id;
      if(coinciden) {
        indice = indice_regla;
      }
      return coinciden;
    });
    if(lanzar_si_no_existe) {
      if(!reglas_con_mismo_id.length) {
        throw new Error("El «id» de regla de evento «" + dato_regla.id + "» no existe en el script de reglas de eventos actual (cambiando o eliminando)");
      }
    } else {
      if(reglas_con_mismo_id.length) {
        throw new Error("El «id» de regla de evento «" + dato_regla.id + "» ya existe en el script de reglas de eventos actual (insertando)");
      }
    }
    return reglas_con_mismo_id;
  }
  lanzar_error_si_id_ya_existe_en_ast(ast1, ast2) {
    return this.lanzar_error_si_id_en_ast(ast1, ast2);
  }
  lanzar_error_si_id_no_existe_en_ast(ast1, ast2) {
    return this.lanzar_error_si_id_en_ast(ast1, ast2, true);
  }
  async insertar_regla(regla, fichero = this.fichero) {
    try {
      this.tracear("Firewall.prototype.insertar_regla");
      const contenido = await this.leer_fichero(fichero);
      let salida = contenido;
      const ast_inicial = this.interpretar_script(contenido);
      const ast_regla = this.interpretar_script(regla);
      Comprobar_que_el_id_no_existe_ya: {
        this.lanzar_error_si_id_ya_existe_en_ast(ast_inicial, ast_regla);
      }
      Insertar_regla: {
        salida = salida.trim();
        salida += salida.length ? "\n\n" : "";
        salida += regla;
      }
      Persistir_estado: {
        await this.escribir_fichero(fichero, salida);
      }
      Recargar_estado: {
        return await this.recargar();
      }
    } catch (error) {
      this.tracear("Error al insertar regla de firewall");
      console.log(error);
      throw error;
    }
  }
  async cambiar_regla(id_de_regla, regla, fichero = this.fichero) {
    try {
      this.tracear("Firewall.prototype.cambiar_regla");
      const contenido = await this.leer_fichero(fichero);
      let salida = contenido;
      const ast_inicial = this.interpretar_script(contenido);
      const ast_regla = this.interpretar_script(regla);
      let regla_coincidente = undefined;
      Comprobar_que_el_id_no_existe_ya: {
        const reglas_coincidentes = this.lanzar_error_si_id_no_existe_en_ast(ast_inicial, ast_regla);
        if(reglas_coincidentes.length !== 1) {
          throw new Error("Múltiples reglas de evento en el script coinciden con este «id» y esto anula la operación de firewall.cambiar_regla");
        }
        regla_coincidente = reglas_coincidentes[0];
      }
      Comprobar_que_el_id_coincide_con_el_nuevo: {
        if(id_de_regla !== ast_regla.ast[0].id) {
          throw new Error("El «id» de la regla de evento a inyectar debe ser el mismo que el «id» de la regla que se pretende alterar");
        }
      }
      Cambiar_regla: {
        const localizacion = regla_coincidente.$loc;
        salida = "";
        salida += contenido.substr(0, localizacion.start.offset).trim();
        salida += "\n\n" + regla.trim() + "\n\n";
        salida += contenido.substr(localizacion.end.offset).trim();

      }
      Persistir_estado: {
        await this.escribir_fichero(fichero, salida);
      }
      Recargar_estado: {
        return await this.recargar();
      }
    } catch (error) {
      this.tracear("Error al cambiar regla de firewall");
      console.log(error);
      throw error;
    }
  }
  async eliminar_regla(id_de_regla, fichero = this.fichero) {
    try {
      this.tracear("Firewall.prototype.eliminar_regla");
      const contenido = await this.leer_fichero(fichero);
      let salida = contenido;
      const ast_inicial = this.interpretar_script(contenido);
      let regla_coincidente = undefined;
      Comprobar_que_el_id_no_existe_ya: {
        const reglas_coincidentes = this.lanzar_error_si_id_no_existe_en_ast(ast_inicial, {ast:[{id: id_de_regla}]});
        if(reglas_coincidentes.length !== 1) {
          throw new Error("Múltiples reglas de evento en el script coinciden con este «id» y esto anula la operación de firewall.cambiar_regla");
        }
        regla_coincidente = reglas_coincidentes[0];
      }
      Cambiar_regla: {
        const localizacion = regla_coincidente.$loc;
        salida = "";
        salida += contenido.substr(0, localizacion.start.offset).trim();
        // salida += "\n\n" + regla.trim() + "\n\n";
        salida += "\n\n" + contenido.substr(localizacion.end.offset).trim();
      }
      Persistir_estado: {
        await this.escribir_fichero(fichero, salida);
      }
      Recargar_estado: {
        return await this.recargar();
      }
    } catch (error) {
      this.tracear("Error al eliminar regla de firewall");
      console.log(error);
      throw error;
    }
  }
}

module.exports = Sistema_lenguaje_firewall;