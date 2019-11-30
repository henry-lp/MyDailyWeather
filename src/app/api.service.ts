import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Subject } from 'rxjs';

const ENDPOINT = 'https://community-open-weather-map.p.rapidapi.com/';
const APIKEY = 'c536e97a7amshfb74659432df827p155167jsna7514caa4538';
const httpOptions = {
  headers: new HttpHeaders({ 'x-rapidapi-key': 'c536e97a7amshfb74659432df827p155167jsna7514caa4538'})
};

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  public cachedForecastApiData: any = {};
  public apiReqCount:number = 0;
  constructor(private http: HttpClient,private route: ActivatedRoute) {
  }

  /* HTTP methods */

  /* 
   * Return today weather status
   */
  getLocationTodayInfo(query:string): Observable<any> {
    const url = ENDPOINT + "weather?" + "q=" + query;
    return this.http.get<any>(url, httpOptions)
    .pipe(
      map(resp => this.handleResponse(resp))
    );
  }

  /* 
   * Return 16 days upto now weather status
   */
  getLocationForecastInfo(query:string): Observable<any>{
    const url = ENDPOINT + "forecast/daily?q=" + query;
    /* return if query has already been made before*/
    if (this.cachedForecastApiData[query]) {
      return of(this.cachedForecastApiData[query]);
    }
    return this.http.get<any>(url,httpOptions).pipe(map(resp => this.handleResponse(resp)));
  }

  /* Query associaty with the data- up to component if want to cache data or not */
  addToForecastCache(query:string,dataToAdd) {
    this.cachedForecastApiData[query] = dataToAdd;
  }

  removeFromForecastCache(query) {
    delete this.cachedForecastApiData[query];
  }

  /* return error message if error */
  private handleResponse(resp: any) {
    if (resp.cod === "404") {
      return resp.message;
    }
    return resp;
  }

  /* Helpers */
  readDate(dt:number,shiftSeconds:number = 0) {
    var date = new Date(dt*1000 + shiftSeconds);

    return date.toISOString().slice(0,10);
  }
}
