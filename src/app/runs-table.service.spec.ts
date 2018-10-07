import { TestBed } from '@angular/core/testing';

import { RunsTableService } from './runs-table.service';

describe('RunsTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RunsTableService = TestBed.get(RunsTableService);
    expect(service).toBeTruthy();
  });
});
