import { TestBed } from '@angular/core/testing';

import { NgxHateoasClient } from './ngx-hateoas-client.service';

describe('HateoasClient', () => {
  let service: NgxHateoasClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxHateoasClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
