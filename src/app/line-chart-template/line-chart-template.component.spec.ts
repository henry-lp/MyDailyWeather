import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartTemplateComponent } from './line-chart-template.component';

describe('LineChartTemplateComponent', () => {
  let component: LineChartTemplateComponent;
  let fixture: ComponentFixture<LineChartTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
