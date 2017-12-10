"use strict";
var RiskMatrix = (function () {
    function RiskMatrix(id, idProject) {
        this.id = id;
        this.idProject = idProject;
        this.hasRisks = false;
        this.Risks = new Array();
    }
    return RiskMatrix;
}());
exports.RiskMatrix = RiskMatrix;
//# sourceMappingURL=riskMatrix.js.map