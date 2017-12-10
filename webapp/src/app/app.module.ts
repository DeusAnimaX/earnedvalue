import { NgModule }                   from '@angular/core';
import { BrowserModule }              from '@angular/platform-browser';
import { FormsModule }                from '@angular/forms';
import { HttpModule, JsonpModule }    from '@angular/http';
import { AppComponent }               from './app.component';
import { AppRoutingModule }           from './app-routing.module'
import { RiskMatrixComponent}         from './riskMatrix.component'
import { EarnedValueComponent }       from './earnedvalue.component'
import { HomeComponent }              from './home.component'



@NgModule({
  imports:
  [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    AppRoutingModule

  ],
  declarations:
  [
    AppComponent,
    RiskMatrixComponent,
    EarnedValueComponent,
    HomeComponent

  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
