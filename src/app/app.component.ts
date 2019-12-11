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
  collection: string = "/accounts";
  constructor(private loginService:LoginService,private router: Router) {
    this.loginInit();
  }

  loginInit() {
    var username = localStorage.getItem("myDailyWeatherUserName");
    var password = localStorage.getItem("myDailyWeatherPassword");
    if (username && password){
      this.loginService.login(username,password);
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}