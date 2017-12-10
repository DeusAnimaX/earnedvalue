"use strict";
var WorkPackage = (function () {
    function WorkPackage(name, description, hours, hourCost, extraCost, actualHourCost, actualHours, actualExtraCost) {
        this.name = name;
        this.description = description;
        this.hours = hours;
        this.hourCost = hourCost;
        this.extraCost = extraCost;
        this.actualHours = actualHours;
        this.actualHourCost = actualHourCost;
        this.actualExtraCost = actualExtraCost;
    }
    return WorkPackage;
}());
exports.WorkPackage = WorkPackage;
//# sourceMappingURL=workPackage.js.map