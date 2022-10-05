import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveBestlumiComponent } from './live-bestlumi.component';

describe('LiveBestlumiComponent', () => {
  let component: LiveBestlumiComponent;
  let fixture: ComponentFixture<LiveBestlumiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveBestlumiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveBestlumiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
