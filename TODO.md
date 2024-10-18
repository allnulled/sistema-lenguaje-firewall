[x] Permitir configuración de precargas
  [x] Que serían rutas de ficheros que quieres cargar cuando haces:
    [x] Para cargar fichero con precargas:
      [x] await firewall.cargar_fichero(ruta)
    [x] Para evitarlo:
      [x] await firewall.cargar_fichero(ruta, { resetear: true })
  [x] No se usa en `cargar_script` porque interrumpiría la sincronicidad del método.
  [x] Puedes precargar cuando quieras usando:
    [x] await firewall.precargar_estado()
[ ] Permitir la API de:
  [ ] Insertar regla en vivo
  [ ] Cambiar regla en vivo
  [ ] Eliminar regla en vivo
  [x] Documentar la API en el README