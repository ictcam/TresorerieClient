import { TestBed } from '@angular/core/testing';

import { CaisseService } from './caisse.service';

describe('CaisseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaisseService = TestBed.get(CaisseService);
    expect(service).toBeTruthy();
  });
});
