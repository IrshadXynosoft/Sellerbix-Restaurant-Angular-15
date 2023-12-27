import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPushNotificationDialogComponent } from './send-push-notification-dialog.component';

describe('SendPushNotificationDialogComponent', () => {
  let component: SendPushNotificationDialogComponent;
  let fixture: ComponentFixture<SendPushNotificationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendPushNotificationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendPushNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
