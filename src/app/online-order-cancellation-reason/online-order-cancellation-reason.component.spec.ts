import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineOrderCancellationReasonComponent } from './online-order-cancellation-reason.component';

describe('OnlineOrderCancellationReasonComponent', () => {
  let component: OnlineOrderCancellationReasonComponent;
  let fixture: ComponentFixture<OnlineOrderCancellationReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineOrderCancellationReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineOrderCancellationReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
