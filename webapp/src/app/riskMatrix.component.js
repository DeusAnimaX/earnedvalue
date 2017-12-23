"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var riskMatrix_1 = require('./interfaces/riskMatrix');
var risk_1 = require('./interfaces/risk');
var router_1 = require('@angular/router');
var RiskMatrixComponent = (function () {
    function RiskMatrixComponent(http, route, router) {
        this.http = http;
        this.route = route;
        this.router = router;
        this.rangoVerde = 1.66;
        this.rangoRojo = 3.34;
        this.baseUrl = 'http://localhost:8080';
        this.riesgos = [];
        this.riesgoTemp = {
            descripcion: "",
            probabilidad: "",
            impacto: "",
            valor: ""
        };
        this.rangoAmarilloMin = this.rangoVerde + 0.01;
        this.rangoAmarilloMax = this.rangoRojo - 0.01;
        this.nombre = "";
    }
    ;
    RiskMatrixComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Defaults to 0 if no query param provided.
        this.riesgos = [];
        this.http.post(this.baseUrl + "/getProjectMatrix", { idProject: localStorage.getItem('idProject') }, { headers: this.getHeaders() })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            _this.nombre = data[0].id.substring(0, data[0].id.length - 7);
            _this.matrix = new riskMatrix_1.RiskMatrix(data[0].id, data[0].idProject);
            _this.http.post(_this.baseUrl + "/getMatrixRisks", { idMatrix: _this.matrix.id }, { headers: _this.getHeaders() })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.riesgos = data;
            }, function (err) { return _this.logError(err); });
        }, function (err) { return _this.logError(err); });
    };
    ;
    RiskMatrixComponent.prototype.agregarRiesgo = function () {
        var _this = this;
		if (_this.riesgoTemp.descripcion === '')
		  return;
		
		if (_this.riesgoTemp.impacto < 0 || _this.riesgoTemp.impacto > 5)
		  return;
		  
		 if (_this.riesgoTemp.probabilidad < 0 || _this.riesgoTemp.probabilidad > 100)
		  return;
		
        this.riesgoTemp.valor = (((+this.riesgoTemp.probabilidad / 100) * +this.riesgoTemp.impacto)).toString();
        var riesgo = new risk_1.Risk(this.riesgoTemp.descripcion, Number(this.riesgoTemp.probabilidad), Number(this.riesgoTemp.impacto), Number(this.riesgoTemp.valor));
        riesgo.idMatrix = this.matrix.id;
        this.riesgoTemp = {
            descripcion: "",
            probabilidad: "",
            impacto: "",
            valor: ""
        };
        this.http.post(this.baseUrl + "/saveRisk", riesgo, { headers: this.getHeaders() })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            _this.riesgos.push(data);
        }, function (err) { return _this.logError(err); });
    };
    ;
    RiskMatrixComponent.prototype.enRangoVerde = function (index) {
        if (+this.riesgos[index].valor <= this.rangoVerde) {
            return true;
        }
        return false;
    };
    ;
    RiskMatrixComponent.prototype.enRangoAmarillo = function (index) {
        if (+this.riesgos[index].valor < this.rangoRojo && +this.riesgos[index].valor > this.rangoVerde) {
            return true;
        }
        return false;
    };
    ;
    RiskMatrixComponent.prototype.enRangoRojo = function (index) {
        if (+this.riesgos[index].valor >= this.rangoRojo) {
            return true;
        }
        return false;
    };
    ;
    RiskMatrixComponent.prototype.getHeaders = function () {
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        return headers;
    };
    ;
    RiskMatrixComponent.prototype.logError = function (err) {
        console.error('There was an error: ' + err);
    };
    ;
    RiskMatrixComponent.prototype.onChangeVerde = function (event) {
        this.rangoVerde = event;
        this.rangoAmarilloMin = +this.rangoVerde + 0.01;
    };
    RiskMatrixComponent.prototype.onChangeRojo = function (event) {
        this.rangoRojo = event;
        this.rangoAmarilloMax = +this.rangoRojo + 0.01;
    };
    RiskMatrixComponent = __decorate([
        core_1.Component({
            selector: 'riskMatrix',
            templateUrl: 'app/view/riskMatrix.html',
            styles: ["\n    .rangoVerde{\n      color: #008000;\n    }\n\n    .rangoAmarillo{\n      color: #FFFF00;\n    }\n\n    .rangoRojo{\n      color: #FF0000;\n    }\n\n  "]
        }), 
        __metadata('design:paramtypes', [http_1.Http, router_1.ActivatedRoute, router_1.Router])
    ], RiskMatrixComponent);
    return RiskMatrixComponent;
}());
exports.RiskMatrixComponent = RiskMatrixComponent;
;
//# sourceMappingURL=riskMatrix.component.js.map