import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FirebaseService } from '../../services/firebase.service';
import { LoginService } from '../../services/login.service';
import { first } from 'rxjs/operators';
import { ChartDataSets } from 'chart.js';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { EventInformerService } from '../../services/event-informer.service';

@Component({
  selector: 'app-personal-view',
  templateUrl: './personal-view.component.html',
  styleUrls: ['./personal-view.component.css']
})
export class PersonalViewComponent implements OnInit {
  public doneLoading:boolean = false;
  stateCtrl: FormControl = new FormControl();
  public message:string;
  public loggedIn:boolean;
  public removeResult:string;
  private lineChartData:ChartDataSets[];
  private addedLocations:string[] = []; //index match with temp/press/himdityData - used to find index later.

  /* Graphs data */
  private overViewTempGraphData: any = {lineChartData:[],lineChartLabels:[]}; //processed json , locationNames order match with lineChartData
  public overViewTempGraphEventSub: Subject<any> = new Subject<any>();

  private overViewPressGraphData: any = {lineChartData:[],lineChartLabels:[]}; //processed json , locationNames order match with lineChartData
  public overViewPressGraphEventSub: Subject<any> = new Subject<any>();
  
  private overViewHumidGraphData: any = {lineChartData:[],lineChartLabels:[]}; //processed json , locationNames order match with lineChartData
  public overViewHumidGraphEventSub: Subject<any> = new Subject<any>();

  /* Table data */
  public weatherTableData:any = {dataSets:[],dates:[]};
  public weatherTableDataSetsSub:Subject<any> = new Subject();

  constructor(private apiService:ApiService,private firebaseService:FirebaseService,private loginService:LoginService,public eventInformer:EventInformerService) { }

  ngOnInit() {
    /* Check login - if not auth then only display basic*/
    this.initView()
    /* Also subscribe to update if change account */
    this.loginService.loginEvent.subscribe((loggedIn) => {
      this.initView();
    })

    this.eventInformer.personalViewRemoveLocationEvent.asObservable().subscribe((evt)=> {
      this.onRemoveCityReq(evt);
    })
    this.doneLoading = true;
  }
  
  /* reset loaded data if logout */
  resetData():void {
    this.lineChartData = undefined;
    /* Reset Graph */
    this.overViewTempGraphData = <any>{lineChartData:[],lineChartLabels:[]};
    this.overViewTempGraphEventSub.next(<any>{lineChartData:undefined,lineChartLabels:undefined});
    this.overViewPressGraphData = <any>{lineChartData:[],lineChartLabels:[]};
    this.overViewPressGraphEventSub.next(<any>{lineChartData:undefined,lineChartLabels:undefined});
    this.overViewHumidGraphData = <any>{lineChartData:[],lineChartLabels:[]};
    this.overViewHumidGraphEventSub.next(<any>{lineChartData:undefined,lineChartLabels:undefined});

    /* reset table */
    this.weatherTableData = {dataSets:[],dates:[]};
    this.weatherTableDataSetsSub.next({dataSets:undefined,dates:[]});

    this.addedLocations = [];
    this.eventInformer.navbarAutoCompleteOptionsProvider.next(this.addedLocations);
    this.doneLoading = false;
    this.removeResult = undefined;
    /* Reset overview - unsubscribe all and create new subject */
  }

  /* Need to initialize view when logged in */
  initView():void {
    this.loggedIn = this.loginService.loggedIn;
    if (this.loggedIn) {
      this.message = undefined;
      this.fetchPersonalData();
    } else {
      this.message = "Please log in to display data";
      this.resetData();
    }   
  }
  
  fetchPersonalData():void {
    this.doneLoading = false;
    this.firebaseService.retrieveUser(this.loginService.username).valueChanges().pipe(first()).subscribe(list => {
      if (list[0].apiData) {
        var count = 1;
        var apiDataList = Object.keys(list[0].apiData); //convert from json to list
        var locNum = apiDataList.length;
        apiDataList.map(cityName => {
          this.apiService.getLocationForecastInfo(cityName).pipe(first()).subscribe(
            async data => {
            this.apiService.addToForecastCache(cityName,data);
            count = this.processDataForGraph(data,count,locNum); //tiny risk of data race on count, happens only if time sum of data process and api data fetch of 2 async is the same
          },
          err => {
            this.message = err.error.message + ". Please wait for 1-3 min before trying again";
          }
          )
        })
        this.message = "Please click on table entry to delete";
        this.eventInformer.navbarAutoCompleteOptionsProvider.next(apiDataList);
      } else {
        this.message = "No data, please search and add a city";
      }
      this.doneLoading = true;
    })
  }

  processDataForGraph(inputData:any,count:number,locNum:number):number {
    var lineChartLabels = [];

    var weatherTableDataSet = {description:[],imgSrc:[],locationName:""};

    /* init format for all data types */
    var tempDataSet = <ChartDataSets>{data:[],label:inputData.city.name,backgroundColor: 'rgba(0,0,0,0)',borderColor:this.randomColorHex(),pointBackgroundColor:"rgb(0,0,0)",pointBorderColor: '#fff',pointHoverBackgroundColor: '#fff',pointHoverBorderColor: 'rgba(148,159,177,0.8)'};
    var pressDataSet = {data:[],label:inputData.city.name,backgroundColor: 'rgba(0,0,0,0)',borderColor:this.randomColorHex(),pointBackgroundColor:"rgb(0,0,0)",pointBorderColor: '#fff',pointHoverBackgroundColor: '#fff',pointHoverBorderColor: 'rgba(148,159,177,0.8)'};
    var humidDataSet = {data:[],label:inputData.city.name,backgroundColor: 'rgba(0,0,0,0)',borderColor:this.randomColorHex(),pointBackgroundColor:"rgb(0,0,0)",pointBorderColor: '#fff',pointHoverBackgroundColor: '#fff',pointHoverBorderColor: 'rgba(148,159,177,0.8)'};
    inputData.list.map((data) => {
      /* Construct graphs */
      tempDataSet.data.push(Math.round((+data.temp.day - 273.1) * 100) / 100); //Kelvin to celcius
      pressDataSet.data.push(data.pressure); //Kelvin to celcius
      humidDataSet.data.push(data.humidity); //Kelvin to celcius

      /* Construct weather status table */
      weatherTableDataSet.description.push(data.weather[0].main);
      weatherTableDataSet.imgSrc.push("https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png")

      /* Add point style - currently does not work - issue on github*/
      lineChartLabels.push(this.apiService.readDate(data.dt));
    })

    /* for overview graphs */
    this.overViewTempGraphData.lineChartData.push(tempDataSet);
    this.overViewTempGraphData.lineChartLabels = lineChartLabels;

    this.overViewPressGraphData.lineChartData.push(pressDataSet);
    this.overViewPressGraphData.lineChartLabels = lineChartLabels;

    this.overViewHumidGraphData.lineChartData.push(humidDataSet);
    this.overViewHumidGraphData.lineChartLabels = lineChartLabels;

    /* for table */
    this.weatherTableData.dates = lineChartLabels;
    weatherTableDataSet.locationName = inputData.city.name;
    this.weatherTableData.dataSets.push(weatherTableDataSet);

    count++;
    /* do this to reduce number of rendering canvas - Special case when the array only have 1 element */
    if(count === locNum || locNum == 1) {
      this.overViewTempGraphEventSub.next(this.overViewTempGraphData);
      this.overViewPressGraphEventSub.next(this.overViewPressGraphData);
      this.overViewHumidGraphEventSub.next(this.overViewHumidGraphData);
      this.weatherTableDataSetsSub.next(this.weatherTableData);
    }
    this.addedLocations.push(inputData.city.name);
    return count;
  }

  /* The user should already be logged in by now */
  onRemoveCityReq(evt:any):void {
    /* Remove all related info in this component */
    var foundIndex;
    var count = 0;
    /* remove from added locations */
    this.addedLocations = this.addedLocations.filter(locationName => {
      if (locationName === evt.locationName) {
        foundIndex = count;
      }
      count++;
      return locationName !== evt.locationName; 
    })

    /* Remove data from component */
    if (foundIndex !== undefined) {
      /* Remove from graphs */
      this.overViewTempGraphData.lineChartData.splice(foundIndex,1);
      this.overViewPressGraphData.lineChartData.splice(foundIndex,1);
      this.overViewHumidGraphData.lineChartData.splice(foundIndex,1);
      /* Remove from table */
      this.weatherTableData.dataSets.splice(foundIndex,1);
      /* Update */
      this.overViewTempGraphEventSub.next(this.overViewTempGraphData);
      this.overViewPressGraphEventSub.next(this.overViewPressGraphData);
      this.overViewHumidGraphEventSub.next(this.overViewHumidGraphData);
      this.eventInformer.navbarAutoCompleteOptionsProvider.next(this.addedLocations);
      this.weatherTableDataSetsSub.next(this.weatherTableData);
    }
    /* Remove from cache */
    this.apiService.removeFromForecastCache(evt.locationName);
    
    /* Remove from database */
    this.firebaseService.removeUserDataFromList(this.loginService.username,"apiData",evt.locationName).subscribe(res => {
      this.removeResult = res;
    });
  }

  /* event handler */
  onLoginEvent(evt:any):void {
    if (evt.loggedIn) {
      this.initView();     
    }
  }

  /* Helper */

  randomColorHex():string {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  
  return color;
}
  generateArray(obj,key){
    return obj[key];
  }
}
