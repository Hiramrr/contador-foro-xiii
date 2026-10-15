const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync(`${__dirname}/script.js`, "utf8");
const context = vm.createContext({});
vm.runInContext(source, context);
const estado = (fecha) => JSON.parse(JSON.stringify(context.obtenerEstado(Date.parse(fecha))));

assert.ok(Number.isFinite(vm.runInContext("INICIO_MS", context)), "La hora debe tener formato HH:MM");
assert.deepEqual(estado("2026-11-12T08:59:59-06:00"), { tipo: "antes", dias: 0, horas: 0, minutos: 0, segundos: 1 });
assert.equal(context.obtenerEstado(Date.parse("2026-11-12T14:59:59.999Z")).segundos, 1);
assert.equal(estado("2026-10-15T09:00:00-06:00").dias, 28);
assert.equal(estado("2026-11-12T09:00:00-06:00").tipo, "durante");
assert.equal(estado("2026-11-13T23:59:59-06:00").tipo, "durante");
assert.equal(estado("2026-11-14T00:00:00-06:00").tipo, "despues");

const sinHora = vm.createContext({});
vm.runInContext(source.replace('const HORA_INICIO = "09:00";', "const HORA_INICIO = null;"), sinHora);
assert.equal(sinHora.obtenerEstado(Date.parse("2026-11-11T23:59:59-06:00")).segundos, 1);
assert.equal(sinHora.obtenerEstado(Date.parse("2026-11-12T00:00:00-06:00")).tipo, "durante");
const html = fs.readFileSync(`${__dirname}/index.html`, "utf8");
const elementos = Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => [id, {
  hidden: false, textContent: "", setAttribute() {}
}]));
context.document = {
  getElementById: (id) => elementos[id],
  querySelector: () => ({ dataset: {} })
};
for (const [fecha, cuentaVisible, avisoVisible] of [
  ["2026-11-12T08:59:59-06:00", true, false],
  ["2026-11-12T09:00:00-06:00", false, true],
  ["2026-11-13T23:59:59-06:00", false, true],
  ["2026-11-14T00:00:00-06:00", false, false]
]) {
  vm.runInContext(`Date.now = () => ${Date.parse(fecha)}`, context);
  context.actualizar();
  assert.equal(elementos.cuenta.hidden, !cuentaVisible, `Cuenta regresiva en ${fecha}`);
  assert.equal(elementos.aviso.hidden, !avisoVisible, `Aviso del foro en ${fecha}`);
}
assert.equal(elementos.estado.textContent, "[ foro concluido ]");
console.log("Comprobaciones correctas: fechas, cuenta regresiva, aviso automático al iniciar, segundo día y cierre.");
