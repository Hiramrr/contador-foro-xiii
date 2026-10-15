"use strict";

// Hora local de Veracruz en formato HH:MM. null cuenta al inicio del día.
const HORA_INICIO = "09:00";
const FECHA_INICIO = "2026-11-12";
const INICIO_MS = Date.parse(`${FECHA_INICIO}T${HORA_INICIO ?? "00:00"}:00-06:00`);
// Límite exclusivo: el foro abarca los días 12 y 13 completos.
const FIN_MS = Date.parse("2026-11-14T00:00:00-06:00");

function obtenerEstado(ahora) {
  if (ahora >= FIN_MS) return { tipo: "despues" };
  if (ahora >= INICIO_MS) return { tipo: "durante" };

  const segundos = Math.ceil((INICIO_MS - ahora) / 1000);
  return {
    tipo: "antes",
    dias: Math.floor(segundos / 86400),
    horas: Math.floor(segundos % 86400 / 3600),
    minutos: Math.floor(segundos % 3600 / 60),
    segundos: segundos % 60
  };
}

function actualizar() {
  const estado = obtenerEstado(Date.now());
  const contador = document.querySelector(".contador");
  contador.dataset.estado = estado.tipo;
  document.getElementById("cuenta").hidden = estado.tipo !== "antes";

  let titulo;
  let nota;
  if (estado.tipo === "antes") {
    titulo = "[ cuenta regresiva ]";
    nota = HORA_INICIO
      ? `El foro comienza el 12 de noviembre a las ${HORA_INICIO} h, hora de Veracruz.`
      : "Cuenta hasta el inicio del 12 de noviembre, 00:00 h en Veracruz. Hora de inauguración por confirmar.";
    for (const unidad of ["dias", "horas", "minutos", "segundos"]) {
      document.getElementById(unidad).textContent = String(estado[unidad]).padStart(2, "0");
    }
    document.getElementById("nombre-dias").textContent = estado.dias === 1 ? "día" : "días";
  } else if (estado.tipo === "durante") {
    titulo = "[ días del foro ]";
    nota = "El XIII Foro se celebra este 12 y 13 de noviembre en el Salón Cristal de la Facultad de Estadística e Informática.";
  } else {
    titulo = "[ foro concluido ]";
    nota = "Gracias por ser parte del XIII Foro. Edición del 12 y 13 de noviembre de 2026.";
  }

  const etiqueta = document.getElementById("estado");
  if (etiqueta.textContent !== titulo) etiqueta.textContent = titulo;
  document.getElementById("nota").textContent = nota;
  document.getElementById("cuenta").setAttribute("aria-label", HORA_INICIO
    ? `Tiempo restante hasta el 12 de noviembre a las ${HORA_INICIO} h`
    : "Tiempo restante hasta el inicio del 12 de noviembre");
}

function avisarAltura() {
  if (window.parent === window) return;
  const alto = Math.ceil(document.body.getBoundingClientRect().height);
  window.parent.postMessage({ tipo: "contador-xiii-foro-altura", alto }, "*");
}

if (typeof document !== "undefined") {
  if (window.parent !== window) document.documentElement.classList.add("incrustado");
  actualizar();
  setInterval(actualizar, 1000);
  document.addEventListener("visibilitychange", actualizar);
  if (window.parent !== window) {
    new ResizeObserver(avisarAltura).observe(document.body);
    window.addEventListener("load", avisarAltura);
  }
}
