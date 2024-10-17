const fs = require("fs");
const child_process = require("child_process");

Construir_firewall_parser: {
  Producir_parser_de_firewall: {
    child_process.execSync("npx pegjs -o sistema_lenguaje_firewall.parser.js sistema_lenguaje_firewall.pegjs", {
      cwd: __dirname
    });
    child_process.execSync("npx pegjs --format globals --export-var sistema_lenguaje_firewall_parser -o sistema_lenguaje_firewall.parser.web.js sistema_lenguaje_firewall.pegjs", {
      cwd: __dirname
    });
  }
  Esparcir_parser_de_firewall: {
    // @OK
  }
}

require(__dirname + "/test.js");