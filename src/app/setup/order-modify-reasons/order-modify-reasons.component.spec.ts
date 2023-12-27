import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderModifyReasonsComponent } from './order-modify-reasons.component';

describe('OrderModifyReasonsComponent', () => {
  let component: OrderModifyReasonsComponent;
  let fixture: ComponentFixture<OrderModifyReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderModifyReasonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderModifyReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
