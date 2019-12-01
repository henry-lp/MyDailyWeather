import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class WeatherDataService {


  url:string = "http://api.openweathermap.org/data/2.5/weather";
  API_KEY:string = "APPID=bf401c378bde690e63e7eddfd761e644";
  city:string = "?q=London,uk&";
  unit:string = "&units=metric";
  
  getData(lat, lon){
   
    return this.http.get(`${this.url}?lat=${lat}&lon=${lon}${this.unit}&${this.API_KEY}`);
    
  }
  
  
  

  constructor(private http: HttpClient) { }
}
