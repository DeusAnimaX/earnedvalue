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
var AppComponent = (function () {
    function AppComponent(http) {
        this.http = http;
        this.title = 'EarnedValue';
        this.baseUrl = 'http://localhost:8080';
        this.projects = [];
        this.getProjects();
    }
    AppComponent.prototype.saveProjectId = function (id) {
        localStorage.setItem('idProject', id);
    };
    AppComponent.prototype.getProjects = function () {
        var _this = this;
        this.http.get(this.baseUrl + "/getAllProjects", { headers: this.getHeaders() })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            _this.projects = [];
            _this.projects = data;
            if (_this.projects.length == 0)
                _this.projects.push({ name: 'Aún no tiene proyectos :(', id: 'notAProject' });
        }, function (err) { return _this.logError(err); });
    };
    AppComponent.prototype.refresh = function () {
        this.getProjects();
    };
    AppComponent.prototype.getHeaders = function () {
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        return headers;
    };
    AppComponent.prototype.logError = function (err) {
        console.error('There was an error: ' + err);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app/app-component.html'
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
;
//# sourceMappingURL=app.component.js.map