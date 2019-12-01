import { Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from '../../services/firebase.service';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { EventInformerService } from '../../services/event-informer.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() showNavSearch:boolean;
  optionsProvider:Observable<string[]>; //provide data for options
  closeResult: string;
  registerResult: string;
  deleteResult:string;
  username: string;
  password: string;
  
  stateCtrl: FormControl = new FormControl();
  results: string[];
  options: string[] = [];
  selected: any;

  public isNavbarCollapsed = false;
  constructor(private modalService: NgbModal,config:NgbDropdownConfig,private firebaseService:FirebaseService,public loginService:LoginService,public eventInformer:EventInformerService) {
    /* Angular bootstrap dropdown */
    config.placement = 'bottom-right';
    config.autoClose = 'outside';
    /* Angular Mat autocomplete */
    this.stateCtrl.valueChanges.pipe(debounceTime(100),distinctUntilChanged()).subscribe(stateCtrl => {
      this.results = this.options.filter(val => {
        return val.toLowerCase().includes(stateCtrl.toLowerCase());
      })
    })

    this.optionsProvider = this.eventInformer.navbarAutoCompleteOptionsProvider.asObservable();
    this.optionsProvider.subscribe(options => {
      this.options = options;
    })
  }

  ngOnInit() {}

  open(content) {
    this.loginService.registerResult = undefined;
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

  /* Alerts */

  closeLoginAlert():void {
    this.loginService.loginError = undefined;
  }

  closeRegisterAlert():void {
    this.loginService.registerResult = undefined;
  }

  /* Logins related */
  login(username:string,password:string):void {
    this.loginService.login(username,password);
    this.username = undefined;
    this.password = undefined;
  }
  
  logout():void {
    this.loginService.logout();
  }

  /* FireBase handling */
  createUser(username:string,password:string):void {
    this.loginService.register(username,password);
  }

  retrieveUser(username:string):Observable<any> {
    return this.firebaseService.retrieveUser(username).valueChanges();
  }
  
  updateUser(username:string,keyName:string,newVal:any):void {
    this.firebaseService.updateUser(username,keyName,newVal);
  }

  deleteUser(username:string):void {
    this.deleteResult = undefined;
    this.firebaseService.deleteUser(username).subscribe(res => {
      this.deleteResult = res;
    });
  }

  /* Ang material autocomplete related */

  /* Emit remove event for above component to delete */
  emitLocationRemoveEvent(val:string) {
    this.eventInformer.personalViewRemoveLocationEvent.next({"locationName":val});
  }

  del():void {
    console.log(this.selected + " is deleted");
    this.stateCtrl.setValue("");
  }
}
