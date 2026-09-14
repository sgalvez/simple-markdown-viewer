# Markdown — Arrastra, abre, lee

**La IA genera el reporte. Tú solo quieres leerlo.**

Un visor de Markdown simple, local y en español. Arrastra un archivo desde el Explorador de Windows al navegador y empieza a leerlo con formato: títulos, tablas, listas y código, cada cosa en su lugar.

### [Abrir el visor →](https://sgalvez.github.io/simple-markdown-viewer/)

Úsalo directamente desde tu navegador, sin instalar nada. GitHub Pages sirve la aplicación; los documentos que abras se procesan en tu equipo y no se suben a GitHub. También puedes ejecutarlo localmente desde WSL.

## Por qué existe

La IA genera cada vez más reportes, análisis, planes y documentación en Markdown. Al final de una conversación, es fácil terminar con varios archivos `.md` que necesitas revisar.

Quería una forma cómoda de leerlos. Las herramientas que había probado me resultaban demasiado aparatosas para algo tan sencillo: abrir un documento y ver su contenido con formato.

Este proyecto es un intento por simplificar ese momento. Una página, un archivo y una vista de lectura. Arrastras el reporte y te concentras en lo que dice.

## Así de simple

1. **Abre el visor** en tu navegador de Windows.
2. **Arrastra tu archivo Markdown** desde el Explorador, o pulsa **Abrir archivo**.
3. **Lee el documento con formato.** Para ver otro, arrástralo sobre la misma página.
4. **Copia el Markdown original** con **Copiar Markdown**, en el encabezado del documento, para pegarlo en otra aplicación.

La interfaz mantiene a mano lo esencial: el nombre del archivo, las acciones para abrir y copiar, y el contenido.

**Copiar Markdown** copia el texto fuente completo, conservando su sintaxis y espacios. El botón muestra **Copiado** durante dos segundos cuando la escritura termina correctamente. Se deshabilita mientras se abre un archivo o se copia, y cuando el documento está vacío o solo contiene espacios. Si falla la apertura de otro archivo, puedes seguir copiando el documento anterior.

La copia requiere un navegador compatible y abrir el visor desde HTTPS (como GitHub Pages) o localhost. Si el navegador impide acceder al portapapeles, aparece un aviso para que puedas revisar los permisos y reintentar.

- **Lectura cómoda:** tipografía clara, una columna centrada y tablas y bloques de código con desplazamiento cuando lo necesitan.
- **Tus archivos, en tu equipo:** el documento se procesa en el navegador y no se sube al servidor.
- **El original permanece intacto:** el visor abre el archivo en modo de solo lectura.
- **Sin cuentas ni servicios externos para leer:** después de instalarlo, la aplicación funciona sin Internet; las imágenes remotas sí necesitan conexión.

## Iniciar desde WSL

Requiere Node.js 22.12 o superior compatible con Vite y npm.

```bash
git clone https://github.com/sgalvez/simple-markdown-viewer.git
cd simple-markdown-viewer
npm install
npm run dev
```

Si ya tienes el proyecto descargado, abre su carpeta en WSL y ejecuta `npm run dev`.

Abre **http://localhost:5173** en Edge o Chrome de Windows. Mantén la terminal abierta; para detener el servidor, pulsa `Ctrl+C`. El servidor escucha en `127.0.0.1`, en el puerto fijo `5173`. Si está ocupado, libera ese puerto antes de iniciar.

WSL permite acceder desde Windows a los servidores Linux mediante localhost. Si tu configuración personalizada de WSL o VPN lo impide, revisa la [documentación de red de WSL](https://learn.microsoft.com/en-us/windows/wsl/networking).

## Qué puedes abrir

- Abre un solo archivo `.md` o `.markdown` en UTF-8. Las extensiones admiten mayúsculas.
- Puedes soltar el archivo sobre cualquier parte de la página, incluso mientras lees otro documento.
- Admite títulos, listas, tablas, citas, enlaces, imágenes con URL HTTP(S), listas de tareas y bloques de código.
- Los enlaces web se abren en una pestaña nueva. Los enlaces a títulos, como `#mi-titulo`, navegan dentro del documento.
- Los errores de formato o lectura conservan el documento anterior.

El contenido se procesa en el navegador con Marked y DOMPurify; no se sube al servidor ni se modifica el archivo original. No hay historial ni persistencia: al recargar la página, vuelve la pantalla inicial. La aplicación no necesita Internet después de instalar las dependencias; las imágenes remotas sí lo necesitan.

Este MVP es de solo lectura. No incluye edición, Mermaid, fórmulas matemáticas ni resaltado de sintaxis. Las imágenes y enlaces con rutas locales relativas no están disponibles: el navegador no recibe acceso a los archivos vecinos del Markdown. Las imágenes locales se muestran como un aviso con su texto alternativo.

## Compilar

```bash
npm run build
npm run preview
```

`build` verifica TypeScript y genera el sitio estático en `dist/`. `preview` permite revisarlo en **http://localhost:5173**, después de detener el servidor de desarrollo.

## Publicación en GitHub Pages

El sitio está disponible en **https://sgalvez.github.io/simple-markdown-viewer/**.

Cada actualización de `main` ejecuta el [flujo de despliegue](.github/workflows/deploy.yml): instala las dependencias con `npm ci`, verifica los tipos, compila para la ruta `/simple-markdown-viewer/` y publica `dist/` en GitHub Pages. También se puede iniciar manualmente desde la pestaña **Actions** del repositorio. El sitio publicado incluye la licencia del proyecto y los avisos de terceros.

## Licencia

Copyright © 2026 **sgalvez**. El proyecto tiene una [licencia propietaria de uso local gratuito](LICENSE).

Puedes descargarlo, instalarlo y usarlo localmente para leer tus documentos, incluidos los reportes de tu trabajo. Redistribuirlo, comercializarlo como producto, ofrecerlo como servicio para terceros o crear versiones derivadas requiere autorización previa por escrito del titular, con las excepciones indicadas en la licencia. Tus documentos siguen siendo tuyos.

El código disponible para consulta no convierte al proyecto en código abierto. Las dependencias conservan sus propias licencias; consulta los [avisos de terceros](public/THIRD_PARTY_NOTICES.txt).

**Sobre los forks:** si este repositorio se publica en GitHub, sus términos permiten visualizarlo y hacer forks dentro de la plataforma. Esta licencia no elimina ese permiso. Para evitar los forks públicos de GitHub, el repositorio debe mantenerse privado; las copias y los forks preexistentes no desaparecen al cambiar la visibilidad. Consulta la [documentación de GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository).
