import { TestBed, inject } from '@angular/core/testing';

import { NormtagService } from './normtag.service';

describe('NormtagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NormtagService]
    });
  });

  it('should ...', inject([NormtagService], (service: NormtagService) => {
    expect(service).toBeTruthy();
  }));
});
