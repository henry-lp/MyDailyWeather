import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherStatusTableComponent } from './weather-status-table.component';

describe('WeatherStatusTableComponent', () => {
  let component: WeatherStatusTableComponent;
  let fixture: ComponentFixture<WeatherStatusTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherStatusTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherStatusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
