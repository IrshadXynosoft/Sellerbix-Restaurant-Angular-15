import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionExpiredPageComponent } from './subscription-expired-page.component';

describe('SubscriptionExpiredPageComponent', () => {
  let component: SubscriptionExpiredPageComponent;
  let fixture: ComponentFixture<SubscriptionExpiredPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionExpiredPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionExpiredPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
