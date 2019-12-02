import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { EventInformerService } from 'src/app/services/event-informer.service';

@Component({
  selector: 'app-weather-status-table',
  templateUrl: './weather-status-table.component.html',
  styleUrls: ['./weather-status-table.component.css'],
})
export class WeatherStatusTableComponent implements OnInit {
  /* Data provided by the component containg this one */
  @Input() weatherTableDataSetsObs:Observable<any>; //expected {dataSets:[],dates[]} , dataset: {description:string[],dates:string[],imgSrc:string[],locationName:string} per location
  weatherTableDataSets: any[];
  dates:string[];

  constructor() { }

  ngOnInit() {
    this.weatherTableDataSetsObs.subscribe(data => {
      if (data) {
        this.weatherTableDataSets = data.dataSets;
        this.dates = data.dates;
      }
    })
  }

}
