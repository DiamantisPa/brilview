import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BXLumiInspectorComponent } from './bxlumi-inspector.component';

describe('BxlumiInspectorComponent', () => {
  let component: BXLumiInspectorComponent;
  let fixture: ComponentFixture<BXLumiInspectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BXLumiInspectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BXLumiInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
