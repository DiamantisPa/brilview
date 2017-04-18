import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegressionsComponent } from './regressions.component';

describe('RegressionsComponent', () => {
  let component: RegressionsComponent;
  let fixture: ComponentFixture<RegressionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegressionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegressionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
