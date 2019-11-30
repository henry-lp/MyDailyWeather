import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule} from 'angularfire2/database';
import { FirebaseService } from './firebase.service';
/* import { environment } from '../environments/environment'; */

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { SearchviewMainComponent } from './searchbview/searchview-main/searchview-main.component';
import { ChartsModule } from 'ng2-charts';
import { LineChartTemplateComponent } from './line-chart-template/line-chart-template.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PersonalViewComponent } from './personal-view/personal-view.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeviewComponent } from './homeview/homeview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import { InViewportModule } from 'ng-in-viewport';
import { WeatherStatusTableComponent } from './weather-status-table/weather-status-table.component';

const firebaseConfig = {
  apiKey: "AIzaSyAzHKfSb1KJb0MQD_gl6_fHd11c9JG2L84",
  authDomain: "mydailyweather.firebaseapp.com",
  databaseURL: "https://mydailyweather.firebaseio.com",
  projectId: "mydailyweather",
  storageBucket: "mydailyweather.appspot.com",
  messagingSenderId: "495302893237",
  appId: "1:495302893237:web:4868af3d224db9b5ff68fc",
  measurementId: "G-23K96S52TN"
}

@NgModule({
  declarations: [
    AppComponent,
    SearchviewMainComponent,
    LineChartTemplateComponent,
    PersonalViewComponent,
    NavbarComponent,
    HomeviewComponent,
    WeatherStatusTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    NgbModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    InViewportModule
  ],
  providers: [
    ApiService,FirebaseService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
