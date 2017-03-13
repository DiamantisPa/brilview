/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LumiChartComponent } from './lumi-chart.component';

describe('LumiChartComponent', () => {
  let component: LumiChartComponent;
  let fixture: ComponentFixture<LumiChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LumiChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LumiChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
