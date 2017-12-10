export class Risk {

  descripcion: string;
  probabilidad: number;
  impacto: number;
  valor: number;
  idMatrix: string;

  constructor( descripcion: string,  probabilidad: number, impacto: number, valor:number) {
    this.descripcion  = descripcion;
    this.probabilidad = probabilidad;
    this.impacto = impacto;
    this.valor = valor;
  }

}
