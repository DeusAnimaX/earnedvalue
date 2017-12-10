"use strict";
var Risk = (function () {
    function Risk(descripcion, probabilidad, impacto, valor) {
        this.descripcion = descripcion;
        this.probabilidad = probabilidad;
        this.impacto = impacto;
        this.valor = valor;
    }
    return Risk;
}());
exports.Risk = Risk;
//# sourceMappingURL=risk.js.map