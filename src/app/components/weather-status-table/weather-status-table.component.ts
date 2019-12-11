import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EventInformerService } from '../../services/event-informer.service';

@Component({
  selector: 'app-weather-status-table',
  templateUrl: './weather-status-table.component.html',
  styleUrls: ['./weather-status-table.component.css'],
})
export class WeatherStatusTableComponent implements OnInit {
  /* Data provided by the component containg this one */
  @Input() weatherTableDataSetsObs:Observable<any>; //expected {dataSets:[],dates[]} , dataset: {description:string[],dates:string[],imgSrc:string[],locationName:string} per location
  @Input() removable: boolean;
  weatherTableDataSets: any[];
  dates:string[];
  cityToRemove:string;
  closeResult: string;

  constructor(private modalService: NgbModal,private eventInformer:EventInformerService) { }

  ngOnInit() {
    this.weatherTableDataSetsObs.subscribe(data => {
      if (data) {
        this.weatherTableDataSets = data.dataSets;
        this.dates = data.dates;
      }
    })
  }
  
  removeCity() {
    this.eventInformer.personalViewRemoveLocationEvent.next({"locationName":this.cityToRemove});
  }

  reject() {
    this.cityToRemove = undefined;
  }

  open(content,cityName:string) {
    /* Only meant for personalview */
    if (!this.removable) {
      return;
    }
    this.cityToRemove = cityName;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size:'sm',centered:true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
