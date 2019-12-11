import { Injectable, Output ,EventEmitter} from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Token } from '../classes/token';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  registerResult: string;
  deleteResult:string;
  loginError:string;
  loggedIn: boolean;
  registered: boolean;
  username: string;
  password: string;
  loginEvent: Subject<any> = new Subject<any>(); //subscribe to listen for loggin changes, current only inform if someone logged in.

  constructor(private firebaseService:FirebaseService) {}

  login(username:string,password:string):void {
    this.loginError = undefined;
    this.loggedIn = false;
    this.firebaseService.authenticate(username,password).subscribe(auth => {
      if (auth) {
        this.updateToken(username);
        this.loggedIn = true;
        /* Save password and username */
        this.password = password;
        this.username = username;

        /* Cache login */
        localStorage.setItem("myDailyWeatherUserName",this.username);
        localStorage.setItem("myDailyWeatherPassword",this.password);

        this.loginEvent.next(this.loggedIn);
      } else {
        this.loginError = "Wrong, please double check!";
        this.loggedIn = false;
      }
    });
  }

  logout():void {
    this.loginError = undefined;
    this.loggedIn = false;
    this.password = undefined;
    this.username = undefined;
    localStorage.setItem("myDailyWeatherUserName",this.username);
    localStorage.setItem("myDailyWeatherPassword",this.password);
    this.loginEvent.next(this.loggedIn);
  }

  register(username:string,password:string):void {
    this.registerResult = undefined;
    this.firebaseService.createUser(username,password).subscribe(res => {
      this.registerResult = res;
    });
  }

  updateToken(username:string) {
    var date = new Date();
    var token = new Token();
    token.value = date.toISOString(); //Better use some random hash
    token.expire = date.toISOString();
    this.firebaseService.updateUser(username,"token",token);
  }
}
