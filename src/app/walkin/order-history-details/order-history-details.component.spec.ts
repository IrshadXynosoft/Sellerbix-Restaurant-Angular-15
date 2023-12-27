import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryDetailsComponent } from './order-history-details.component';

describe('OrderHistoryDetailsComponent', () => {
  let component: OrderHistoryDetailsComponent;
  let fixture: ComponentFixture<OrderHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderHistoryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
