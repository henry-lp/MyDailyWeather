import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter} from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType, PointStyle } from 'chart.js';
import {  Color,Label } from 'ng2-charts';
import {ApiService} from '../../services/api.service';
import { LoginService } from '../../services/login.service';
import { FirebaseService } from '../../services/firebase.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-line-chart-template',
  templateUrl: './line-chart-template.component.html',
  styleUrls: ['./line-chart-template.component.css']
  /* changeDetection: ChangeDetectionStrategy.OnPush */
})
export class LineChartTemplateComponent implements OnInit {
  @Input() locationName:string; //json string
  @Input() inputDataPackage:any;
  @Input() overViewGraphUpdateEvent:Observable<any>;
  @Input() overViewGraph: boolean;
  @Input() personalView: boolean; 
  @Input() graphTitle: string;
  
  public apiJsonData: any;
  public errorMessage: string;
  public lineChartData: ChartDataSets[];
  public finishLoading:boolean = false;
  public labelLoaded:boolean = false;
  public lineChartLabels: Label[];
  public lineChartOptions: (ChartOptions) = {
    title: {
      display: false,
      text: 'my chart',
      fontSize: 20
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{}],
      yAxes: [{}]
    },
    legend: {
      position: 'bottom'
    }
  };

  public lineChartColors: Color[];

  public lineChartLegend = true;
  public lineChartType:ChartType = 'line';
  public lineChartPlugins = [];
  public overViewSub:Subscription;
  constructor(private apiService:ApiService,private loginService:LoginService,private firebaseService:FirebaseService) {}

  ngOnInit() {
    if (this.overViewGraph) {
      this.overViewSub = this.overViewGraphUpdateEvent.subscribe((overviewData)=> {
        this.finishLoading = false;
        this.lineChartData = overviewData.lineChartData;
        this.lineChartLabels = overviewData.lineChartLabels;
        /* In case when logout, only load html when not logout case */
        if(overviewData.lineChartData && overviewData.lineChartLabels) {
          this.finishLoading = true;
        }
      })
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if( this.overViewSub) {
      this.overViewSub.unsubscribe();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.constructGraphDataUponChanges(changes);
  }

  constructGraphDataUponChanges(changes:SimpleChanges):void {
    if (!changes.inputDataPackage || !this.inputDataPackage) {
      return;
    }
    this.reset();
    this.finishLoading = false;
    /* this.lineChartOptions.title.text = this.inputDataPackage.locationName;
    this.lineChartOptions.title.display = true; */
    this.lineChartLegend = false;
    this.lineChartData = this.inputDataPackage.lineChartData;
    this.lineChartLabels = this.inputDataPackage.lineChartLabels;
    this.forceChartRefresh();
  }

  constructDataGivenLocation(locationName:string) {
    this.apiService.getLocationForecastInfo(locationName).subscribe(
      (data) =>{
      /* Cache it for use later */
      this.apiService.addToForecastCache(locationName,data);
      this.apiJsonData = data;
      var dataSet = {data:[],label:this.apiJsonData.city.name};
      this.apiJsonData.list.map((data) => {
        dataSet.data.push(data.temp.day);
        /* Only load label once - all data should have the same label */
        if (!this.labelLoaded) {
          this.lineChartLabels.push(this.apiService.readDate(data.dt));
        }
      })
      this.labelLoaded = true;
      this.lineChartData.push(dataSet);},
      (error) => {
        this.errorMessage = error.error.message;
      },
      () => {
        this.finishLoading = true;
      }
    )
  }

  reset() {
    this.errorMessage = undefined; //reset error message from previous request
    this.lineChartData = [];
    this.lineChartLabels = [];
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public changeLabel() {
    this.lineChartLabels[2] = ['1st Line', '2nd Line'];
    // this.chart.update();
  }

  @Output() addCityReq = new EventEmitter();
  @Output() removeCityReq = new EventEmitter();
  /* Emit add city event - the above component should handle this with login service */
  addCity() {
    this.addCityReq.emit({"locationName":this.inputDataPackage.locationName});
  }

  removeCity() {
    /* Also remove it from api cache */
    this.removeCityReq.emit({"locationName":this.inputDataPackage.locationName});
  }

  /* Chartjs bug - need to update like this */
  forceChartRefresh(time:number = 0) {
    setTimeout(() => {
      this.finishLoading = true;
    }, time);
  }
}
