import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeViewComponent } from './components/home-view/home-view.component';
import { CurrentWeatherComponent } from './components/current-weather/current-weather.component';
import { DateAndTimeComponent } from './components/date-and-time/date-and-time.component';
import { ConcatenatePipe } from './components/current-weather/concatenate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeViewComponent,
    CurrentWeatherComponent,
    DateAndTimeComponent,
    ConcatenatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
