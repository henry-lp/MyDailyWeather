import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-and-time',
  templateUrl: './date-and-time.component.html',
  styleUrls: ['./date-and-time.component.css']
})
export class DateAndTimeComponent implements OnInit {

  getTime(){
    let date = new Date();
    let hours = date.getHours();
    let minuts = date.getMinutes();
    let seconds = date.getSeconds();
    document.getElementById("time").innerHTML= hours + ':' + minuts + ':' + seconds + '<br/>';
    document.getElementById("time").innerHTML+= date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate();
  }


  constructor() { 
    
  }

  ngOnInit() {
    setInterval(this.getTime, 1000);
  }

}








