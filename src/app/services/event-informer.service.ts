import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/* To pass the event from a component to another component - keeping all subjects*/
export class EventInformerService {
  public navbarAutoCompleteOptionsProvider:Subject<any> = new Subject(); // To provide options to the autocomplete input on the navbar at personal view 
  public personalViewRemoveLocationEvent:Subject<any> = new Subject(); // format {locationName:string}

  constructor() { }
}
