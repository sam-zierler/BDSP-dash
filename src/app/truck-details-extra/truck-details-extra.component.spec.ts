import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckDetailsExtraComponent } from './truck-details-extra.component';

describe('TruckDetailsExtraComponent', () => {
  let component: TruckDetailsExtraComponent;
  let fixture: ComponentFixture<TruckDetailsExtraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckDetailsExtraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckDetailsExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
