import { Component } from '@angular/core';
import { slideInAnimation } from './animation';
import { RouterOutlet, Router, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';
import { LoginService } from './services/login.service';
import { Navigation } from 'selenium-webdriver';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})

export class AppComponent {
  private EventToChildSub: Subject<any> = new Subject();
  private username: string;
  private password: string;
  collection: string = "/accounts";
  constructor(private loginService:LoginService,private router: Router) {
    this.username = localStorage.getItem("myDailyWeatherUserName");
    this.password = localStorage.getItem("myDailyWeatherPassword");
    if (this.username !== "undefined" && this.password !== "undefined") {
      this.loginInit();
    }
  }

  loginInit() {
    if (this.username && this.password){
      this.loginService.login(this.username,this.password);
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}