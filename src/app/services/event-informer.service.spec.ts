import { TestBed } from '@angular/core/testing';

import { EventInformerService } from './event-informer.service';

describe('EventInformerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventInformerService = TestBed.get(EventInformerService);
    expect(service).toBeTruthy();
  });
});
