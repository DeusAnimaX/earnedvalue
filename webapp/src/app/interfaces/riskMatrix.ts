import { Risk } from './Risk'

export class RiskMatrix {
  id: string;
  idProject: string;
  hasRisks : boolean;
  Risks: Risk[];

  constructor(id: string,  idProject: string){
    this.id = id;
    this.idProject = idProject;
    this.hasRisks = false;
    this.Risks = new Array<Risk>();
  }
}
