import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenSaleNotificationComponent } from './open-sale-notification.component';

describe('OpenSaleNotificationComponent', () => {
  let component: OpenSaleNotificationComponent;
  let fixture: ComponentFixture<OpenSaleNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenSaleNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenSaleNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
