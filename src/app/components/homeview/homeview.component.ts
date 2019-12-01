import { Component, OnInit, HostListener} from '@angular/core';

@Component({
  selector: 'app-homeview',
  templateUrl: './homeview.component.html',
  styleUrls: ['./homeview.component.css']
})

export class HomeviewComponent implements OnInit {
  private i:number=1;
  constructor() { }

  ngOnInit() {
  }

}
