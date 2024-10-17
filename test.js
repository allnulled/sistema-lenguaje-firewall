const fs = require("fs");

const main = async function () {
  Testear_sintaxis_firewall: {
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
    const Sistema_lenguaje_firewall = require(__dirname + "/sistema_lenguaje_firewall.api.js");
    const firewall = Sistema_lenguaje_firewall.crear();
    firewall.registrar("saludar", function(mensaje) {
      console.log("Evento 1");
      console.log(mensaje);
    });
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
    const ast2 = await firewall.cargar_fichero(__dirname + "/tests/readme.fwl");
    console.log(ast2);
  }
};

module.exports = main();