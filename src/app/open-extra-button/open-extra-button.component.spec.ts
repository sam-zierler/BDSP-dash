import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenExtraButtonComponent } from './open-extra-button.component';

describe('OpenExtraButtonComponent', () => {
  let component: OpenExtraButtonComponent;
  let fixture: ComponentFixture<OpenExtraButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenExtraButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenExtraButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
