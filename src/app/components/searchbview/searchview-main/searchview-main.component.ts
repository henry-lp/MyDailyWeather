import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { LoginService } from '../../../services/login.service';
import { FirebaseService } from '../../../services/firebase.service';
import { first } from 'rxjs/operators';
import { EventInformerService } from 'src/app/services/event-informer.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-searchview-main',
  templateUrl: './searchview-main.component.html',
  styleUrls: ['./searchview-main.component.css']
})

export class SearchviewMainComponent implements OnInit {
  public temperatureData:any;
  public pressureData:any;
  public humidData:any;
  public locationName: string; //json from api
  public errorMessage:string;
  public searchTxt: string = "";
  public prevSearchTxt: string;
  public locationResult:string;
  public searching:boolean = false;
  public searchSuccess:boolean;
  public stateCtrl: FormControl = new FormControl();
  /* Table data */
  public weatherTableDataSetsSub:Subject<any> = new Subject();

  constructor(public apiService:ApiService,private loginService:LoginService,private firebaseService:FirebaseService,private eventInformer:EventInformerService) { 
    this.stateCtrl.valueChanges
    .pipe(debounceTime(600),distinctUntilChanged()).subscribe(val => {
      this.searchTxt = val;
      this.search();
    })  
  }

  ngOnInit() {
  }
  
  search():void {
    if (this.prevSearchTxt === this.searchTxt || this.searchTxt === "") {
      return; // no searching if it's equal to previous or not containing any string
    }
    this.searching = true;
    this.prevSearchTxt = this.searchTxt;
    this.locationResult = undefined;
    this.apiService.getLocationForecastInfo(this.searchTxt).pipe(first()).subscribe(data => {
      this.processDataForGraph(data);},
      err => {
        this.searchSuccess = false;
        this.locationResult = err.error.message;
        this.searching = false;
      }
    )
  }

  processDataForGraph(inputData:any):void {
    var lineChartLabels = [];
    var tempLineChartData = [];
    var pressLineChartData = [];
    var humidLineChartData = [];
    
    var tempDataSet = {data:[],label:inputData.city.name,backgroundColor: 'rgba(0,0,0,0)',borderColor:this.randomColorHex(),pointBackgroundColor:"rgb(0,0,0)",pointBorderColor: '#fff',pointHoverBackgroundColor: '#fff',pointHoverBorderColor: 'rgba(148,159,177,0.8)'};
    var pressDataSet = {data:[],label:inputData.city.name,backgroundColor: 'rgba(0,0,0,0)',borderColor:this.randomColorHex(),pointBackgroundColor:"rgb(0,0,0)",pointBorderColor: '#fff',pointHoverBackgroundColor: '#fff',pointHoverBorderColor: 'rgba(148,159,177,0.8)'};
    var humidDataSet = {data:[],label:inputData.city.name,backgroundColor: 'rgba(0,0,0,0)',borderColor:this.randomColorHex(),pointBackgroundColor:"rgb(0,0,0)",pointBorderColor: '#fff',pointHoverBackgroundColor: '#fff',pointHoverBorderColor: 'rgba(148,159,177,0.8)'};
    var weatherTableDataSet = {description:[],imgSrc:[],locationName:""};
    inputData.list.map((data) => {
      /* Construct graph data */
      tempDataSet.data.push((Math.round((+data.temp.day - 273.1) * 100) / 100)); //convert from kelvin to Celcius
      pressDataSet.data.push(data.pressure);
      humidDataSet.data.push(data.humidity)
      lineChartLabels.push(this.apiService.readDate(data.dt));

      /* Construct weather status table */
      weatherTableDataSet.description.push(data.weather[0].main);
      weatherTableDataSet.imgSrc.push("https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png")
    })

    /* Graph data */
    tempLineChartData.push(tempDataSet);
    pressLineChartData.push(pressDataSet);
    humidLineChartData.push(humidDataSet);
    
    var tempDataPackage = {lineChartData:[],lineChartLabels:[],locationName:""};
    tempDataPackage.lineChartData = tempLineChartData;
    tempDataPackage.lineChartLabels = lineChartLabels;
    tempDataPackage.locationName = inputData.city.name;
    this.temperatureData = tempDataPackage;

    var pressDataPackage = {lineChartData:[],lineChartLabels:[],locationName:""};
    pressDataPackage.lineChartData = pressLineChartData;
    pressDataPackage.lineChartLabels = lineChartLabels;
    pressDataPackage.locationName = inputData.city.name;
    this.pressureData = pressDataPackage;

    var humidDataPackage = {lineChartData:[],lineChartLabels:[],locationName:""};
    humidDataPackage.lineChartData = humidLineChartData;
    humidDataPackage.lineChartLabels = lineChartLabels;
    humidDataPackage.locationName = inputData.city.name;
    this.humidData = humidDataPackage;

    /* table data */
    var weatherTableData:any = {dataSets:[],dates:[]};
    weatherTableData.dates = lineChartLabels;
    weatherTableDataSet.locationName = inputData.city.name;
    weatherTableData.dataSets.push(weatherTableDataSet);
    this.weatherTableDataSetsSub.next(weatherTableData);
    
    this.searching = false;
  }

  /* expect {cityName: nameVal} */
  /* Should be some kind of modal */
  onAddCityReq(evt:any):void {
    if (this.loginService.loggedIn) {
      this.firebaseService.appendUserDataToList(this.loginService.username,"apiData",evt.locationName).subscribe(res => {
          this.searchSuccess = true;
          this.locationResult = "Location " + res;
        }
      );
    } else {
      this.searchSuccess = false;
      this.locationResult = "log in required!";
    }
  }
  
  onRemoveCityReq(evt:any):void {
    if (this.loginService.loggedIn) {
      this.firebaseService.removeUserDataFromList(this.loginService.username,"apiData",evt.locationName).subscribe(res => {
        this.locationResult = "Location " + res;}
      );
    } else {
      this.locationResult = "log in required!";
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

  close() {
    this.locationResult = undefined;
    this.searchSuccess = undefined;
  }

}
