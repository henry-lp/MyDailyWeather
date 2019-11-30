import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchviewMainComponent } from './searchview-main.component';

describe('SearchviewMainComponent', () => {
  let component: SearchviewMainComponent;
  let fixture: ComponentFixture<SearchviewMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchviewMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchviewMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
