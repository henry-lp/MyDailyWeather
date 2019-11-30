import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-weather-status-table',
  templateUrl: './weather-status-table.component.html',
  styleUrls: ['./weather-status-table.component.css']
})
export class WeatherStatusTableComponent implements OnInit {
  /* Data provided by the component containg this one */
  @Input() weatherTableDataSetsObs:Observable<any>; //expected {dataSets:[],dates[]} , dataset: {description:string[],dates:string[],imgSrc:string[],locationName:string} per location
  weatherTableDataSets: any[];
  dates:string[];
  /*  dates:string[] = ["2019-12-13","2019-12-13","2019-12-13","2019-12-13","2019-12-13","2019-12-13","2019-12-13"]
  locationDatas: any[] = [
    {description:["rain","rain","rain"],imgSrc:["http://openweathermap.org/img/wn/10d@2x.png","http://openweathermap.org/img/wn/10d@2x.png","http://openweathermap.org/img/wn/10d@2x.png"],locationName:"Stockholm"},
    {description:["rain","rain","rain"],imgSrc:["http://openweathermap.org/img/wn/10d@2x.png","http://openweathermap.org/img/wn/10d@2x.png","http://openweathermap.org/img/wn/10d@2x.png"],locationName:"Stockholm"}
  ]; */ //expected json {description:string[],imgSrc:string,locationName:string}

  constructor() { }

  ngOnInit() {
    if (this.weatherTableDataSetsObs) {
      this.weatherTableDataSetsObs.subscribe(data => {
        this.weatherTableDataSets = data.dataSets;
        this.dates = data.dates;
      })
    }
  }

}
