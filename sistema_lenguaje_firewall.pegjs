{
    const ordenar_objetos = function(ast) {
        for(let index=0; index<ast.length; index++) {
          const item = ast[index];
          item.orden = index;
        }
        return ast;
    }
}

Lenguaje_de_firewall = _* ast:Sentencia_completa* _* { return { ast: ordenar_objetos(ast) } }

Sentencia_completa = Sentencia_de_escucha_a_evento

Bloque_normal = _* sentencias:Sentencia_de_bloque* _* { return sentencias.map(s => s.replace(/;$/g, "")).join(";\n") }

Bloque_normal_entre_parentesis_curvados = 
  token1:(_* "{" _*)
  bloque:Bloque_normal
  token2:(_* "}")
    { return bloque }

Sentencia_de_bloque = sentencia:(
  Sentencia_de_proceso /
  Sentencia_de_siempre /
  Sentencia_de_si )
    { return sentencia }

Sentencia_de_escucha_a_evento = 
  token1:(_*)
  id:(Nombre_de_regla)?
  token2:(_* ("en eventos" / "en evento" / "on events" / "on event") _*)
  eventos:Texto_en_parentesis_curvados_n
  token3:(_* ("ocurre que" / "entonces" / "then") _*)
  bloque:(Bloque_normal_entre_parentesis_curvados/Bloque_de_js)
    { return { tipo: "sentencia de regla", id, eventos, bloque, $loc: location(), $tex: text() } }
  
Sentencia_de_proceso = 
  token1:(_* ("en proceso" / "in process") _+)
  proceso:Nombre_de_proceso
  token2:(_* ":" _*)
  bloque:Bloque_normal_entre_parentesis_curvados
    { return proceso + ": {" + bloque + "}" }

Nombre_de_proceso = [A-Za-z$_] [A-Za-z0-9$_]* { return text() }
Nombre_de_regla = Texto_en_parentesis_cuadrados_n

Sentencia_de_siempre = 
  token1:(_* ("siempre" / "anytime") _+ )
  bloque:Bloque_de_js
    { return bloque }

Sentencia_de_si = 
  token1:(_* ("si"/"if") _*)
  condicion:Condicional_especifico
  token2:(_* ("entonces"/"then") _* )
  consecuencia:(Bloque_normal_entre_parentesis_curvados/Bloque_de_js)
  alternativas:Subsentencia_de_o_si?
    { return "if(" + condicion + ") {" + consecuencia + "}" + (alternativas ?? "") }

Subsentencia_de_o_si = 
  o_si:Subsentencia_de_o_si_n+
  o_si_no:Subsentencia_de_o_si_no_entonces?
    { return  o_si.join("") + (o_si_no ?? "") }

Subsentencia_de_o_si_no_entonces =
  token1:(_* ("o si no entonces" / "else") _*)
  consecuencia:(Bloque_normal_entre_parentesis_curvados/Bloque_de_js)
    { return "\n  else {" + consecuencia + "}" }

Subsentencia_de_o_si_n =
  token1:(_* ("o si" / "else if") _*)
  condicion:Condicional_especifico
  token2:(_* ("entonces"/"then") _* )
  consecuencia:(Bloque_normal_entre_parentesis_curvados/Bloque_de_js)
    { return "\n  else if(" + condicion + ") {" + consecuencia + "}" }

Bloque_de_js = texto:(
  Texto_en_parentesis_cuadrados_con_dos_puntos /
  Texto_en_parentesis_cuadrados_4 /
  Texto_en_parentesis_cuadrados_3 /
  Texto_en_parentesis_cuadrados_2 /
  Texto_en_parentesis_curvados_4 /
  Texto_en_parentesis_curvados_3 /
  Texto_en_parentesis_curvados_2 /
  Texto_en_parentesis_curvados_1_con_arroba )
    { return texto }

Texto_en_parentesis_curvados_n = 
  Texto_en_parentesis_curvados_4 /
  Texto_en_parentesis_curvados_3 /
  Texto_en_parentesis_curvados_2 /
  Texto_en_parentesis_curvados_1 

Texto_en_parentesis_curvados_4 = "{{{{" texto:Negar_parentesis_curvados_cerrados_4 "}}}}" { return texto }
Negar_parentesis_curvados_cerrados_4 = (!("}}}}") .)+ { return text() }

Texto_en_parentesis_curvados_3 = "{{{" texto:Negar_parentesis_curvados_cerrados_3 "}}}" { return texto }
Negar_parentesis_curvados_cerrados_3 = (!("}}}") .)+ { return text() }

Texto_en_parentesis_curvados_2 = "{{" texto:Negar_parentesis_curvados_cerrados_2 "}}" { return texto }
Negar_parentesis_curvados_cerrados_2 = (!("}}") .)+ { return text() }

Texto_en_parentesis_curvados_1 = "{" texto:Negar_parentesis_curvados_cerrados_1 "}" { return texto }
Negar_parentesis_curvados_cerrados_1 = (!("}") .)+ { return text() }

Texto_en_parentesis_curvados_1_con_arroba = "@{" texto:Negar_parentesis_curvados_cerrados_1 "}" { return texto }

Texto_en_parentesis_cuadrados_con_dos_puntos = "[:" texto:Negar_parentesis_cuadrados_cerrados_con_dos_puntos_1 ":]" { return texto }
Negar_parentesis_cuadrados_cerrados_con_dos_puntos_1 = (!(":]") .)+ { return text() }

Texto_en_parentesis_cuadrados_n = 
  Texto_en_parentesis_cuadrados_4 /
  Texto_en_parentesis_cuadrados_3 /
  Texto_en_parentesis_cuadrados_2 /
  Texto_en_parentesis_cuadrados_1 

Texto_en_parentesis_cuadrados_4 = "[[[[" texto:Negar_parentesis_cuadrados_cerrados_4 "]]]]" { return texto }
Negar_parentesis_cuadrados_cerrados_4 = (!("]]]]") .)+ { return text() }

Texto_en_parentesis_cuadrados_3 = "[[[" texto:Negar_parentesis_cuadrados_cerrados_3 "]]]" { return texto }
Negar_parentesis_cuadrados_cerrados_3 = (!("]]]") .)+ { return text() }

Texto_en_parentesis_cuadrados_2 = "[[" texto:Negar_parentesis_cuadrados_cerrados_2 "]]" { return texto }
Negar_parentesis_cuadrados_cerrados_2 = (!("]]") .)+ { return text() }

Texto_en_parentesis_cuadrados_1 = "[" texto:Negar_parentesis_cuadrados_cerrados_1 "]" { return texto }
Negar_parentesis_cuadrados_cerrados_1 = (!("]") .)+ { return text() }


Expresion_basica = Bloque_de_js

Condicional_especifico = Expresion_agrupable_3

Expresion_negable_1 = 
  token1:(_* )
  negacion:(((("not" / "no") _+)/"!") _*)?
  expres:Expresion_basica
  extras:Expresiones_and_y_or?
    { return (negacion ? "!" : "") + expres + (extras ?? "") }

Expresion_agrupada_2 = 
  negacion:(((("not" / "no") _+)/"!") _*)?
  token1:(_* "(" _*)
  expres:Expresion_agrupable_3
  token3:(_* ")")
  extras:Expresiones_and_y_or?
    { return (negacion ? "!" : "") + "(" + expres + ")" + (extras ?? ""); }

Expresion_agrupable_3 = ( Expresion_negable_1 / Expresion_agrupada_2 )

Expresiones_and_y_or = Expresion_and_y_or+

Expresion_and_y_or =
  token1:(_+)
  op:("and" / "or" / "y" / "o")
  token2:(_+)
  expres:Expresion_agrupable_3
    { return (op === "y" ? " && " : " || ") + expres }


/*
x
no x
(x)
no (x)
(no x)
(no (x))
*/





_ = (__ / ___)
__ = ("\t" / " ")
___ = ("\r\n" / "\r" / "\n")