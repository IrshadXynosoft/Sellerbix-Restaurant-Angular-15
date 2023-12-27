import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAreaComponent } from './delivery-area.component';

describe('DeliveryAreaComponent', () => {
  let component: DeliveryAreaComponent;
  let fixture: ComponentFixture<DeliveryAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
