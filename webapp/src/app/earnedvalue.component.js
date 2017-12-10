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
var core_2 = require('@angular/core');
var http_1 = require('@angular/http');
var workPackage_1 = require('./interfaces/workPackage');
require('rxjs/add/operator/toPromise');
require('rxjs/add/operator/map');
require('rxjs/add/operator/share');
var router_1 = require('@angular/router');
var _ = require('underscore');
require('rxjs/add/operator/takeUntil');
var Subject_1 = require('rxjs/Subject');
var EarnedValueComponent = (function () {
    //   randomQuote = 'is this a randomQuote?';
    function EarnedValueComponent(http, route, router) {
        this.http = http;
        this.route = route;
        this.router = router;
        this.ngUnsubscribe = new Subject_1.Subject();
        this.baseUrl = 'http://localhost:8080';
        this.sprints = [];
        this.workPackage = new workPackage_1.WorkPackage("", "", "", "", "", "", "", "");
        this.initEarnedValueAttrs();
    }
    //
    EarnedValueComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route
            .queryParams
            .subscribe(function (params) {
            // Defaults to 0 if no query param provided.
            _this.title = "";
            _this.sprints = [];
            _this.isCreate = true;
            _this.isSprintSelected = true;
            if (Object.keys(params).length !== 0) {
                _this.http.post(_this.baseUrl + "/getProject", params, { headers: _this.getHeaders() })
                    .map(function (res) { return res.json(); })
                    .subscribe(function (data) {
                    _this.title = data.name;
                    localStorage.setItem('idProject', data.id);
                    _this.http.post(_this.baseUrl + "/getProjectSprints", data, { headers: _this.getHeaders() })
                        .map(function (res) { return res.json(); })
                        .subscribe(function (data) {
                        _this.sprints = _this.getSprintWorkPackages(data);
                        _this.isCreate = false;
                    }, function (err) { return _this.logError(err); });
                }, function (err) { return _this.logError(err); });
            }
        });
    };
    EarnedValueComponent.prototype.initEarnedValueAttrs = function () {
        this.AC = 0;
        this.CV = 0;
        this.SV = 0;
        this.SPI = 0;
        this.CPI = 0;
        this.PC = 0;
        this.AH = 0;
        this.PH = 0;
    };
    EarnedValueComponent.prototype.saveProject = function () {
        var _this = this;
        var body = { project: { name: this.projectName, cantSprints: this.cantSprints } };
        this.cleanProjectAttributes();
        this.http.post(this.baseUrl + "/saveProject", body, { headers: this.getHeaders() })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            _this.title = data.name;
            _this.setSprints(data.cantSprints, data.id);
        }, function (err) { return _this.logError(err); });
        //el post le retorna el id del proyecto y despues se lo manda a los sprints
    };
    EarnedValueComponent.prototype.setSprints = function (cantSprints, projectId) {
        var _this = this;
        var length = +cantSprints;
        var sprints;
        sprints = [];
        for (var i = 0; i < length; i++)
            sprints.push({ id: 'sprint' + (i + 1), idProject: projectId, name: 'Sprint ' + (i + 1), workPackages: [] });
        this.http.post(this.baseUrl + "/saveSprints", sprints, { headers: this.getHeaders() })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { _this.sprints = data; }, function (err) { return _this.logError(err); });
    };
    EarnedValueComponent.prototype.setWorkPackage = function (sprint, workPackage) {
        this.isCreatePackage = false;
        this.sprint = sprint;
        this.workPackage = workPackage;
    };
    //Se hace separado ya que al ser un observable cold se suscribe dos veces
    EarnedValueComponent.prototype.saveWorkPackage = function () {
        var _this = this;
        this.isCreate = false;
        var workPackage = {
            id: this.workPackage.id,
            idSprint: this.sprint.id,
            name: this.workPackage.name,
            description: this.workPackage.description,
            hours: this.workPackage.hours,
            hourCost: this.workPackage.hourCost,
            extraCost: this.workPackage.extraCost,
            actualHours: this.workPackage.actualHours,
            actualHourCost: this.workPackage.actualHourCost,
            actualExtraCost: this.workPackage.actualExtraCost };
        this.http.post(this.baseUrl + "/saveWorkPackage", workPackage, { headers: this.getHeaders() })
            .map(function (res) { return res.json(); })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (data) {
            if (_this.sprint.workPackages == undefined)
                _this.sprint.workPackages = [];
            if (_this.workPackage.id == undefined)
                _this.sprint.workPackages.push(data);
            _this.workPackage = new workPackage_1.WorkPackage("", "", "", "", "", "", "", "");
        }, function (err) { return _this.logError(err); });
    };
    EarnedValueComponent.prototype.cleanProjectAttributes = function () {
        this.projectName = "";
        this.cantSprints = "";
    };
    EarnedValueComponent.prototype.getHeaders = function () {
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        return headers;
    };
    EarnedValueComponent.prototype.logError = function (err) {
        console.error('There was an error: ' + err);
    };
    EarnedValueComponent.prototype.getSprint = function (sprint, action) {
        this.workPackage = new workPackage_1.WorkPackage("", "", "", "", "", "", "", "");
        this.isCreatePackage = true;
        this.sprint = sprint;
    };
    EarnedValueComponent.prototype.getSprintWorkPackages = function (data) {
        var _this = this;
        var sprints;
        sprints = [];
        data.forEach(function (sprint) {
            _this.http.post(_this.baseUrl + "/getSprintWorkPackages", sprint, { headers: _this.getHeaders() })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                sprint.workPackages = [];
                sprint.workPackages = data;
                sprints.push(sprint);
            }, function (err) { return _this.logError(err); });
        });
        return sprints;
    };
    ;
    EarnedValueComponent.prototype.calculateEarnedValue = function (id) {
        var sps;
        sps = [];
        this.isSprintSelected = false;
        var workPackages;
        workPackages = [];
        for (var i = 0; i < this.sprints.length; i++) {
            var spId = this.sprints[i].id;
            sps.push(_.find(this.sprints, function (sprint) { return sprint.id == spId; }));
            if (this.sprints[i].id === id) {
                break;
            }
        }
        this.getValues(sps);
    };
    EarnedValueComponent.prototype.getValues = function (sprint) {
        var _this = this;
        this.earnedValue = [];
        var ev = {};
        var acSprint = 0;
        var pcSprint = 0;
        var phSprint = 0;
        var ahSprint = 0;
        this.initEarnedValueAttrs();
        sprint.forEach(function (sprint) {
            acSprint = 0;
            pcSprint = 0;
            phSprint = 0;
            ahSprint = 0;
            ev = {};
            sprint.workPackages.forEach(function (wp) {
                _this.AC += +wp.actualHours * +wp.actualHourCost + +wp.actualExtraCost;
                _this.PC += +wp.hours * +wp.hourCost + +wp.extraCost;
                _this.PH += +wp.hours;
                _this.AH += +wp.actualHours;
                acSprint += (+wp.actualHours * +wp.actualHourCost + +wp.actualExtraCost);
                pcSprint += (+wp.hours * +wp.hourCost + +wp.extraCost);
                phSprint += (+wp.hours);
                ahSprint += (+wp.actualHours);
            });
            ev = {
                name: sprint.name,
                SV: (phSprint - ahSprint),
                CV: (pcSprint - acSprint),
                SPI: (phSprint / ahSprint),
                CPI: (pcSprint / acSprint),
            };
            _this.earnedValue.push(ev);
        });
        this.SV = this.PH - this.AH;
        this.CV = this.PC - this.AC;
        this.SPI = this.PH / this.AH;
        this.CPI = this.PC / this.AC;
    };
    ;
    EarnedValueComponent.prototype.isGreen = function (index) {
        if (index == 1) {
            return true;
        }
        return false;
    };
    ;
    EarnedValueComponent.prototype.isYellow = function (index) {
        if (index > 1) {
            return true;
        }
        return false;
    };
    ;
    EarnedValueComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    EarnedValueComponent = __decorate([
        core_1.Component({
            selector: 'earnedvalue',
            templateUrl: 'app/view/earnedvalue.html',
            styles: ["\n\t\t.rangoVerde{\n\t\t\tcolor: #008000;\n\t\t}\n\n\t\t.rangoAmarillo{\n\t\t\tcolor: #FFFF00;\n\t\t}\n\n\t\t.rangoRojo{\n\t\t\tcolor: #FF0000;\n\t\t}\n\n\t\t"]
        }),
        core_2.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, router_1.ActivatedRoute, router_1.Router])
    ], EarnedValueComponent);
    return EarnedValueComponent;
}());
exports.EarnedValueComponent = EarnedValueComponent;
;
//# sourceMappingURL=earnedvalue.component.js.map