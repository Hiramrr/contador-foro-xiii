# Contador del XIII Foro

Cuenta regresiva estilo TUI para el XIII Foro de Divulgación Científica en Ciencias de la Computación, el 12 y 13 de noviembre de 2026 en el Salón Cristal de la Facultad de Estadística e Informática, Xalapa, Veracruz. La inauguración es el 12 de noviembre a las 09:00 h, hora de Veracruz.

HTML, CSS y JavaScript sin dependencias. La página funciona al abrir `index.html` directamente y se publica en GitHub Pages para insertarla en WordPress con un iframe.

Sitio: [hiramrr.github.io/contador-foro-xiii](https://hiramrr.github.io/contador-foro-xiii/).

Repositorio: [Hiramrr/contador-foro-xiii](https://github.com/Hiramrr/contador-foro-xiii).

## Ver en tu computadora

Abre `index.html`, o inicia un servidor local dentro de esta carpeta.

```sh
python3 -m http.server 8013
```

Visita [http://localhost:8013](http://localhost:8013).

## Hora de inauguración

La cuenta apunta al 12 de noviembre de 2026 a las 09:00 h, hora de Veracruz, según el horario que confirmaste.

Para modificar la hora, cambia la primera constante de `script.js`. Usa dos dígitos para la hora y dos para los minutos, en formato `HH:MM`.

```js
const HORA_INICIO = "09:00";
```

Al guardar una hora, el contador y su nota usan ese horario. Actualiza también la hora visible en los datos de `index.html`. Con `null`, el contador vuelve al inicio del día y aclara que la inauguración está por confirmar.

Si cambias las fechas del evento, actualiza `FECHA_INICIO` y el límite exclusivo `FIN_MS` al principio de `script.js`. Cambia también las fechas escritas en sus notas y en el `aria-label`, los textos y elementos `time` de `index.html`, y las fechas esperadas en `check.cjs`.

El contador usa instantes con el desplazamiento `-06:00`. Su resultado no depende de la zona horaria de quien lo visita. Durante los días del foro muestra un mensaje de celebración. Desde el 14 de noviembre muestra el cierre. No afirma que haya una transmisión en vivo.

## Archivos

| Archivo | Contenido |
| --- | --- |
| `index.html` | Título, fechas, sede y estructura accesible |
| `styles.css` | TUI blanca con azul y verde, escritorio y celular |
| `script.js` | Hora editable, cuenta, estados y altura del iframe |
| `assets/` | Composición de la facultad, círculos y cuadros en WebP |
| `check.cjs` | Nueve comprobaciones de fechas y cambios de estado |
| `insertar.html` | Iframe listo para pegar, con altura automática |

El diseño usa fondo blanco, tipografía monoespaciada, un XIII en caracteres de bloque y marcos de terminal en azul. No tiene barra superior ni pie. La composición del campus conserva el edificio, los círculos azules y los cuadros azules y verdes, con margen alrededor de la torre. Un recorte del 5 % inferior deja horizontal la base de la imagen.

La imagen se recompuso con la herramienta integrada imagegen a partir de las referencias y la foto original. El prompt usado está en `assets/campus.prompt.txt` y el activo final de la página está en `assets/campus.webp`.

## Insertar en WordPress

GitHub Pages sirve los archivos de la rama `main`, carpeta raíz. Para publicar un cambio, súbelo a esa rama.

Agrega un bloque HTML personalizado y pega el contenido de [insertar.html](insertar.html), o el bloque siguiente.

```html
<iframe
  id="contador-xiii-foro"
  src="https://hiramrr.github.io/contador-foro-xiii/"
  title="Cuenta regresiva del XIII Foro de Divulgación Científica en Ciencias de la Computación"
  width="100%"
  height="1000"
  style="display:block; width:100%; border:0;">
</iframe>
<script>
  window.addEventListener("message", function (e) {
    var marco = document.getElementById("contador-xiii-foro");
    if (!marco || e.source !== marco.contentWindow) return;
    if (e.origin !== new URL(marco.src).origin) return;
    if (!e.data || e.data.tipo !== "contador-xiii-foro-altura") return;
    var alto = e.data.alto;
    if (typeof alto === "number" && Number.isFinite(alto) && alto > 0 && alto < 10000) {
      marco.style.height = Math.ceil(alto) + "px";
    }
  });
</script>
```

El mensaje ajusta la altura cuando cambia el ancho o el contenido. Dentro del iframe, la página quita su margen exterior. Si WordPress elimina el script, conserva la altura de respaldo y permite desplazarse para leer el contenido completo.

## Comprobar las fechas

Con Node.js instalado, ejecuta lo siguiente.

```sh
node check.cjs
```

Comprueba la cuenta antes del inicio, el último milisegundo, los dos días del evento, el cierre y una hora de inicio configurada. El contador se actualiza con el reloj actual en cada segundo y al volver a la pestaña, sin acumular retrasos de intervalos.

## Accesibilidad

El título es texto HTML, las fechas usan `time` y la sede usa una lista de definiciones. El XIII en caracteres de bloque tiene una alternativa de texto para lectores de pantalla. El contador tiene `role="timer"` y no anuncia los segundos en voz alta. El estado comunica los cambios con texto y solo se anuncia cuando cambia. Sin JavaScript, las fechas y la sede siguen visibles. El contenido conserva el desplazamiento vertical para que una altura fija del iframe no lo vuelva inaccesible.
