import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NormtagSelectComponent } from './normtag-select.component';

describe('NormtagSelectComponent', () => {
  let component: NormtagSelectComponent;
  let fixture: ComponentFixture<NormtagSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormtagSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormtagSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
