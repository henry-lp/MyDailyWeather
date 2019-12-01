import { Component, OnInit } from '@angular/core';
import { WeatherDataService } from '../services/weather-data.service';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit {
  lat;
  lon;
  obj:any;

  getLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(success =>{
        this.lat=success.coords.latitude;
        this.lon=success.coords.longitude;

        this.weather.getData(this.lat,this.lon).subscribe(response =>{
          this.obj = response;
        })
      },
      function(error) {
        if (error.code == error.PERMISSION_DENIED)
          console.log("you denied me :-(");
          document.getElementById("weather").innerHTML=" <h1>No current position weather information available<h1/>"
      });
    }
   
   
  }


  constructor(private weather:WeatherDataService) { 
    
  }

  ngOnInit() {
    this.getLocation();

  }

}
