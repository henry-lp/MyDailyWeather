import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule} from 'angularfire2/database';
import { FirebaseService } from './services/firebase.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { SearchviewMainComponent } from './components/searchbview/searchview-main/searchview-main.component';
import { ChartsModule } from 'ng2-charts';
import { LineChartTemplateComponent } from './components/line-chart-template/line-chart-template.component';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { PersonalViewComponent } from './components/personal-view/personal-view.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeviewComponent } from './components/homeview/homeview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import { InViewportModule } from 'ng-in-viewport';
import { WeatherStatusTableComponent } from './components/weather-status-table/weather-status-table.component';
import {environment} from '../environments/environment'

import { CurrentWeatherComponent } from './components/current-weather/current-weather.component';
import { DateAndTimeComponent } from './components/date-and-time/date-and-time.component';
import { ConcatenatePipe } from './components/current-weather/concatenate.pipe';
import { ErrorPageComponent } from './components/error-page/error-page.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchviewMainComponent,
    LineChartTemplateComponent,
    PersonalViewComponent,
    NavbarComponent,
    HomeviewComponent,
    WeatherStatusTableComponent,
    CurrentWeatherComponent,
    DateAndTimeComponent,
    ConcatenatePipe,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    NgbModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    InViewportModule,
    NgbPopoverModule
  ],
  providers: [
    ApiService,FirebaseService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
