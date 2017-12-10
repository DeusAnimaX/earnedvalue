
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component'
import { EarnedValueComponent }   from './earnedvalue.component';
import { RiskMatrixComponent } from './riskMatrix.component'

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',  component: HomeComponent },
  { path: 'earnedvalue',  component: EarnedValueComponent },
  { path: 'riskMatrix',  component: RiskMatrixComponent },


];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
