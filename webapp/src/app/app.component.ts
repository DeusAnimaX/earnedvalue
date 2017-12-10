import {Component} from '@angular/core'
import { Headers, Http, Response } from '@angular/http';


@Component({
  selector: 'my-app',
  templateUrl: 'app/app-component.html'
})
export class AppComponent {
  title = 'EarnedValue';
  projects : any[];

  private baseUrl: string = 'http://localhost:8080';

  constructor (private http: Http){
    this.projects = [];
    this.getProjects();
  }

  saveProjectId(id:string){
    
    localStorage.setItem('idProject',id);
  }

  getProjects(){
    this.http.get(`${this.baseUrl}/getAllProjects`, { headers: this.getHeaders() })
    .map(res => res.json())
    .subscribe(
      data => {
        this.projects = [];
        this.projects = data;
        if(this.projects.length ==0)
          this.projects.push({name:'Aún no tiene proyectos :(', id:'notAProject'});
      },
      err => this.logError(err),
    );
  }

  refresh(){
    this.getProjects();
  }
  private getHeaders() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');

    return headers;
  }
  logError(err: String) {
    console.error('There was an error: ' + err);

  }


};
