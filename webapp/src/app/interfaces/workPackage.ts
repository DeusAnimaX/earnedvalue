export class WorkPackage {


     constructor( name: string,  description: string, hours: string, hourCost:string,extraCost:string,actualHourCost:string,actualHours:string,actualExtraCost:string) {
          this.name  = name;
          this.description = description;
          this.hours = hours;
          this.hourCost = hourCost;
          this.extraCost = extraCost;
          this.actualHours = actualHours;
          this.actualHourCost = actualHourCost;
          this.actualExtraCost = actualExtraCost;
        }
  id: string;
  name: string;
  description : string;
  hours: string;
  hourCost: string;
  extraCost: string;
  actualHours:string;
  actualHourCost: string;
  actualExtraCost: string;


}
