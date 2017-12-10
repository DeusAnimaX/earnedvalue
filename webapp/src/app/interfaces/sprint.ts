import {WorkPackage} from './WorkPackage'

export class Sprint {
  id: number;
  name: string;
  postion: number;
  hasWorkPackages : boolean;
  workPackages: WorkPackage[];
}
