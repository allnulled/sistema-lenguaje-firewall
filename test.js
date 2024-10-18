const fs = require("fs");

const main = async function () {
  const configuraciones = {
    tests: [
      "sintaxis",
      // "api.normal",
      "api.reglas"
    ]
  }
  Testear_sintaxis_firewall: {
    if(configuraciones.tests.indexOf("sintaxis") === -1) {
      break Testear_sintaxis_firewall;
    }
    const sistema_lenguaje_firewall_parser = require(__dirname + "/sistema_lenguaje_firewall.parser.js");
    const test_results = {};
    let test_file = undefined;
    try {
      const test_files = fs.readdirSync(__dirname + "/tests");
      Iterando_tests:
      for (let index = 0; index < test_files.length; index++) {
        test_file = test_files[index];
        const test_contents = fs.readFileSync(__dirname + "/tests/" + test_file).toString();
        console.log(test_contents);
        if(test_file === "norun.fwl") {
          continue Iterando_tests;
        }
        const test_result = sistema_lenguaje_firewall_parser.parse(test_contents);
        test_results[test_file] = {
          order: index,
          data: test_result
        };
      }
      fs.writeFileSync(__dirname + "/test.results.json", JSON.stringify(test_results, null, 2), "utf8");
      // @OK
    } catch (error) {
      console.log("Error en test «" + test_file + "»");
      console.log(error);
    }
  }
  Testear_api_de_firewall: {
    if(configuraciones.tests.indexOf("api.normal") === -1) {
      break Testear_api_de_firewall;
    }
    const Sistema_lenguaje_firewall = require(__dirname + "/sistema_lenguaje_firewall.api.js");
    const firewall = Sistema_lenguaje_firewall.crear({
      precargas: [__dirname + "/tests/auth.fwl"],
      globales: {
        log: console.log,
        trace: (msg, ...args) => console.log("[TRACE] " + msg, ...args),
        prohibir: (msg, name) => { throw new Error(msg); },
        permitir: (msg) => {},
        continuar: () => {},
      }
    });
    firewall.registrar("saludar", function(mensaje) {
      console.log("Evento 1");
      console.log(mensaje);
    });
    const ast_0 = await firewall.cargar_fichero(__dirname + "/tests/readme.fwl");
    const ast = await firewall.cargar_fichero(__dirname + "/tests/firewall1.fwl");
    firewall.emitir("saludar", "Hola!");
    const observador = await firewall.escuchar_fichero(__dirname + "/tests/firewall1.fwl");
    const id_timeout_1 = setInterval(() => firewall.emitir("saludar", { mensaje: "Este es el mensaje" }), 1 * 1000);
    const id_timeout_2 = setInterval(() => {
      firewall.emitir("super.hiper.mega.guay", firewall.eventos);
    }, 1 * 1000);
    const n = 3;
    await new Promise((resolve, reject) => {
      setTimeout(() => observador.close(), 1000 * n);
      setTimeout(() => clearInterval(id_timeout_1), 1000 * n);
      setTimeout(() => clearInterval(id_timeout_2), 1000 * n);
      setTimeout(() => resolve(), (1000 * n) + 1000);
    });
  }
  Testear_api_de_firewall_para_cambiar_reglas: {
    if(configuraciones.tests.indexOf("api.reglas") === -1) {
      break Testear_api_de_firewall_para_cambiar_reglas;
    }
    const Sistema_lenguaje_firewall = require(__dirname + "/sistema_lenguaje_firewall.api.js");
    const firewall = Sistema_lenguaje_firewall.crear({
      precargas: [],
      globales: {
        log: console.log,
        trace: (msg, ...args) => console.log("[TRACE] " + msg, ...args),
        prohibir: (msg, name) => { throw new Error(msg); },
        permitir: (msg) => {},
        continuar: () => {},
      }
    });
    require("fs/promises").writeFile(__dirname + "/tests/cambios.fwl", "", "utf8");
    const dato = await firewall.cargar_fichero(__dirname + "/tests/cambios.fwl");
    console.log("Al inicio:");
    console.log(dato);
    const dato_insertado = await firewall.insertar_regla("[rule 1] on events {*} then {{ console.log('Insertado!'); }}");
    console.log("Al insertar:");
    console.log(dato_insertado);
    const dato_cambiado = await firewall.cambiar_regla("rule 1", "[rule 1] on events {*} then {{ console.log('Cambiado!'); }}");
    console.log("Al cambiar:");
    console.log(dato_cambiado);
    const dato_eliminado = await firewall.eliminar_regla("rule 1");
    console.log("Al eliminar:");
    console.log(dato_eliminado);
    const dato_insertado_2 = await firewall.insertar_regla("[rule 2] on events {*} then {{\n  console.log('Esto es que se pasaron los tests de la API de cambios de reglas!');\n}}");
  }
};

module.exports = main().catch(error => {
  console.log(error);
  throw error;
});