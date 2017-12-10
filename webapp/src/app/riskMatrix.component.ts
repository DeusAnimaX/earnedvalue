import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { RiskMatrix } from './interfaces/riskMatrix'
import { Risk } from './interfaces/risk'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'riskMatrix',
  templateUrl: 'app/view/riskMatrix.html',
  styles: [`
    .rangoVerde{
      color: #008000;
    }

    .rangoAmarillo{
      color: #FFFF00;
    }

    .rangoRojo{
      color: #FF0000;
    }

  `]
})
export class RiskMatrixComponent {
  riesgos: Risk[];
  riesgo: Risk;
  riesgoTemp: {
    descripcion : string,
    probabilidad : string,
    impacto : string,
    valor: string
  };
  rangoVerde: number = 1.66;
  rangoRojo: number = 3.34;
  rangoAmarilloMin: number;
  rangoAmarilloMax: number;
  nombre: string;
  matrix: RiskMatrix;

  private baseUrl: string = 'http://localhost:8080';

  constructor(private http: Http, private route: ActivatedRoute,
		private router: Router) {
    this.riesgos = [];
    this.riesgoTemp = {
      descripcion : "",
      probabilidad : "",
      impacto : "",
      valor: ""
    };
    this.rangoAmarilloMin = this.rangoVerde + 0.01;
    this.rangoAmarilloMax = this.rangoRojo - 0.01;
    this.nombre = "";
  };

  ngOnInit() {

      // Defaults to 0 if no query param provided.
        this.riesgos = [];

        this.http.post(`${this.baseUrl}/getProjectMatrix`,{idProject:localStorage.getItem('idProject')} , { headers: this.getHeaders() })
        .map(res => res.json())
        .subscribe(
          data => {

            this.nombre = data[0].id.substring(0,data[0].id.length-7);
            this.matrix = new RiskMatrix(data[0].id,data[0].idProject);

            this.http.post(`${this.baseUrl}/getMatrixRisks`, {idMatrix:this.matrix.id}, { headers: this.getHeaders() })
            .map(res => res.json())
            .subscribe(
              data => {
                this.riesgos = data;
              },
              err => this.logError(err),
            );
          },
          err => this.logError(err),
        );
  };

  public agregarRiesgo(){
    this.riesgoTemp.valor = (((+this.riesgoTemp.probabilidad / 100 ) * +this.riesgoTemp.impacto)).toString();
    let riesgo = new Risk(this.riesgoTemp.descripcion,Number(this.riesgoTemp.probabilidad),Number(this.riesgoTemp.impacto), Number(this.riesgoTemp.valor));
    riesgo.idMatrix = this.matrix.id;

    this.riesgoTemp = {
      descripcion : "",
      probabilidad : "",
      impacto : "",
      valor: ""
    };
    this.http.post(`${this.baseUrl}/saveRisk`, riesgo, { headers: this.getHeaders() })
    .map(res => res.json())
    .subscribe(
      data => {
        this.riesgos.push(data);
      },
      err => this.logError(err),
    );


  };

  public enRangoVerde(index: number): boolean{
    if(+this.riesgos[index].valor <= this.rangoVerde){
      return true;
    }
    return false;
  };

  public enRangoAmarillo(index: number): boolean{
    if(+this.riesgos[index].valor < this.rangoRojo && +this.riesgos[index].valor > this.rangoVerde){
      return true;
    }
    return false;
  };

  public enRangoRojo(index: number): boolean{
    if(+this.riesgos[index].valor >= this.rangoRojo){
      return true;
    }
    return false;
  };

  private getHeaders() {
  	let headers = new Headers();
  	headers.append('Accept', 'application/json');
  	return headers;
	};

  logError(err: String) {
    console.error('There was an error: ' + err);
	};

  onChangeVerde(event: any){
    this.rangoVerde = event;
    this.rangoAmarilloMin = +this.rangoVerde + 0.01;

  }

  onChangeRojo(event: any){
    this.rangoRojo = event;
    this.rangoAmarilloMax = +this.rangoRojo + 0.01;

  }


};
