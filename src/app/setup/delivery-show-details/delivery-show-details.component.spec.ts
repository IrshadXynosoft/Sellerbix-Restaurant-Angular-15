import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryShowDetailsComponent } from './delivery-show-details.component';

describe('DeliveryShowDetailsComponent', () => {
  let component: DeliveryShowDetailsComponent;
  let fixture: ComponentFixture<DeliveryShowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryShowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryShowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
