import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit {
  lat;
  lon;
  obj:any;

  public temp:number;
  getLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(success =>{
        this.lat=success.coords.latitude;
        this.lon=success.coords.longitude;

        this.apiService.getLocationTodayInfo(this.lat,this.lon,"metric").subscribe(response =>{
          this.obj = response;
          this.temp = Math.round((+this.obj.main.temp - 273.1) * 100) / 100; // Convert from kelvin to celcius
        })
      });
    }
   
   
  }


  constructor(private apiService:ApiService) { 
    
  }

  ngOnInit() {
    this.getLocation();

  }

}
