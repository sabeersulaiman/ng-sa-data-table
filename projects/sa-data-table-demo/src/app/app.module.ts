import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgSaDataTableModule } from 'ng-sa-data-table';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSaDataTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
