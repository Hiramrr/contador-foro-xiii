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
console.log("9 comprobaciones correctas: hora configurada, cuenta regresiva, zona horaria, inicio, dos días y cierre.");
