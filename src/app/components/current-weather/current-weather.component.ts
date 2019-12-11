import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit {
  public lat;
  public lon;
  public obj:any;
  public errorMsg:string;
  public temp:number;
  public displaySpinner:boolean = true;
  getLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(success =>{
        this.lat=success.coords.latitude;
        this.lon=success.coords.longitude;

        this.apiService.getLocationTodayInfo(this.lat,this.lon,"metric").subscribe(
          response =>{
            this.obj = response;
            this.temp = Math.round((+this.obj.main.temp - 273.1) * 100) / 100;
            this.displaySpinner = false;},
          err => {
            this.errorMsg = err.error.message + ". Please wait for 1-3 min before trying again";
            this.displaySpinner = false;
          }
        )
      });
    }
   
   
  }


  constructor(private apiService:ApiService) { 
    
  }

  ngOnInit() {
    this.getLocation();

  }

}
