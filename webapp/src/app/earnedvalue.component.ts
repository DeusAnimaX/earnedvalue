import { Component, Input } from '@angular/core'
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import {NgForm} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Sprint} from './interfaces/sprint'
import { WorkPackage} from './interfaces/workPackage'
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';


@Component({
	selector: 'earnedvalue',
	templateUrl: 'app/view/earnedvalue.html',
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

	@Injectable()
	export class EarnedValueComponent {
		private ngUnsubscribe: Subject<void> = new Subject<void>();
		title : "";
		projectName : "";
		cantSprints : "";
		sprints : Sprint[];
		sprint : Sprint;
		isOpen : false;
		workPackage : WorkPackage;
		isCreatePackage : boolean;
		isCreate : boolean;
		AC: number;
		CV: number;
		SV: number;
		SPI: number;
		CPI: number;
		PC : number;
		AH : number;
		PH : number;
		isSprintSelected: boolean;
		earnedValue : any[]

		private baseUrl: string = 'http://localhost:8080';

		//   randomQuote = 'is this a randomQuote?';
		constructor(private http: Http, private route: ActivatedRoute,
			private router: Router) {
				this.sprints = [];
				this.workPackage = new WorkPackage("","","","","","","","");
				this.initEarnedValueAttrs();
			}
			//
			ngOnInit() {
				this.route
				.queryParams
				.subscribe(params => {
					// Defaults to 0 if no query param provided.
					this.title = ""
					this.sprints = [];
					this.isCreate = true;
					this.isSprintSelected = true;
					if(Object.keys(params).length !== 0){
						this.http.post(`${this.baseUrl}/getProject`, params, { headers: this.getHeaders() })
						.map(res => res.json())
						.subscribe(
							data => {
								this.title = data.name;
								localStorage.setItem('idProject',data.id);
								this.http.post(`${this.baseUrl}/getProjectSprints`, data, { headers: this.getHeaders() })
								.map(res => res.json())
								.subscribe(
									data => {
										this.sprints =this.getSprintWorkPackages(data);
										this.isCreate = false;
									},
									err => this.logError(err),
								);
							},
							err => this.logError(err),

						);
					}
				});
			}
			private initEarnedValueAttrs(){
				this.AC= 0;
				this.CV= 0;
				this.SV= 0;
				this.SPI= 0;
				this.CPI= 0;
				this.PC = 0;
				this.AH = 0;
				this.PH = 0;
			}

			saveProject(){
				var body = { project:{name:this.projectName,cantSprints:this.cantSprints}};
				this.cleanProjectAttributes();

				this.http.post(`${this.baseUrl}/saveProject`, body, { headers: this.getHeaders() })
				.map(res => res.json())
				.subscribe(
					data => {
						this.title = data.name;
						this.setSprints(data.cantSprints, data.id);
					},
					err => this.logError(err),

				);
				//el post le retorna el id del proyecto y despues se lo manda a los sprints

			}

			private setSprints(cantSprints: String, projectId: String){
				var length = +cantSprints;
				var sprints : any[];
				sprints = [];

				for(var i =0; i < length; i++)
				sprints.push({id:'sprint'+(i+1),idProject:projectId, name: 'Sprint '+(i+1), workPackages:[]});

				this.http.post(`${this.baseUrl}/saveSprints`, sprints, { headers: this.getHeaders() })
				.map(res => res.json())
				.subscribe(
					data => {this.sprints =data},
					err => this.logError(err),
				);
			}
			setWorkPackage(sprint:Sprint,workPackage: WorkPackage){
				this.isCreatePackage = false;
				this.sprint = sprint;
				this.workPackage = workPackage;
			}

			//Se hace separado ya que al ser un observable cold se suscribe dos veces
			saveWorkPackage (){
				this.isCreate = false;
				var workPackage = {
					id: this.workPackage.id,
					idSprint:this.sprint.id,
					name:this.workPackage.name,
					description:this.workPackage.description,
					hours:this.workPackage.hours,
					hourCost:this.workPackage.hourCost,
					extraCost:this.workPackage.extraCost,
					actualHours:this.workPackage.actualHours,
					actualHourCost:this.workPackage.actualHourCost,
					actualExtraCost:this.workPackage.actualExtraCost};

					this.http.post(`${this.baseUrl}/saveWorkPackage`,workPackage , { headers: this.getHeaders() })
					.map(res => res.json())
					.takeUntil(this.ngUnsubscribe)
					.subscribe(
						data => {

							if(this.sprint.workPackages == undefined)
							this.sprint.workPackages = [];
							if(this.workPackage.id == undefined)
							this.sprint.workPackages.push(data);

							this.workPackage = new WorkPackage("","","","","","","","");
						},
						err => this.logError(err),
					);
				}


				private cleanProjectAttributes (){
					this.projectName = "";
					this.cantSprints = "";
				}

				private getHeaders() {
					let headers = new Headers();
					headers.append('Accept', 'application/json');

					return headers;
				}
				logError(err: String) {
					console.error('There was an error: ' + err);

				}
				getSprint(sprint: Sprint, action :String){
					this.workPackage = new WorkPackage("","","","","","","","");
					this.isCreatePackage = true;
					this.sprint = sprint;
				}

				getSprintWorkPackages(data : Sprint[]){
					var sprints : Sprint[];
					sprints = [];
					data.forEach(sprint => {
						this.http.post(`${this.baseUrl}/getSprintWorkPackages`, sprint, { headers: this.getHeaders() })
						.map(res => res.json())
						.subscribe(
							data => {
								sprint.workPackages = [];
								sprint.workPackages = data;
								sprints.push(sprint);

							},
							err => this.logError(err),
						);
					});
					return sprints;
				};
				calculateEarnedValue(id: number){

					var sps: Sprint[];
					sps = [];
					this.isSprintSelected = false;
					var workPackages :any[];
					workPackages = [];
					for(var i = 0; i<this.sprints.length;i++){
						var spId =this.sprints[i].id;
						sps.push(_.find(this.sprints,function(sprint){ return sprint.id == spId }));
						if(this.sprints[i].id===id){ break; }
					}

					this.getValues(sps);
				}

				getValues(sprint:Sprint[]){
					this.earnedValue = [];
					var ev = {};
					var acSprint = 0;
					var pcSprint = 0;
					var phSprint = 0;
					var ahSprint = 0;
					this.initEarnedValueAttrs();
					sprint.forEach(sprint =>{
						acSprint = 0;
						pcSprint = 0;
						phSprint = 0;
						ahSprint = 0;
						ev = {};
						sprint.workPackages.forEach(wp=>{

								this.AC +=  +wp.actualHours* +wp.actualHourCost + +wp.actualExtraCost;
								this.PC +=  +wp.hours* +wp.hourCost + +wp.extraCost;
								this.PH +=  +wp.hours;
								this.AH +=  +wp.actualHours;


							acSprint += (+wp.actualHours* +wp.actualHourCost + +wp.actualExtraCost);
							pcSprint += (+wp.hours* +wp.hourCost + +wp.extraCost);
							phSprint += (+wp.hours);
							ahSprint += (+wp.actualHours);
						});

						ev = {
							name: sprint.name,
							SV : (phSprint-ahSprint),
							CV :  (pcSprint-acSprint),
							SPI : (phSprint/ahSprint),
							CPI : (pcSprint/acSprint),
						};
						this.earnedValue.push(ev);
					});
					this.SV = this.PH -this.AH;
					this.CV = this.PC -this.AC;
					this.SPI = this.PH/this.AH;
					this.CPI = this.PC/this.AC;

				};
				public isGreen(index: any): boolean{
					if(index == 1 ){
						return true;
					}
					return false;
				};
				public isYellow(index: any): boolean{
					if(index > 1 ){
						return true;
					}
					return false;
				};
				ngOnDestroy() {
					this.ngUnsubscribe.next();
					this.ngUnsubscribe.complete();
				}

			};
