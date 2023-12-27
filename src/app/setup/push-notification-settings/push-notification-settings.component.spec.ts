import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushNotificationSettingsComponent } from './push-notification-settings.component';

describe('PushNotificationSettingsComponent', () => {
  let component: PushNotificationSettingsComponent;
  let fixture: ComponentFixture<PushNotificationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PushNotificationSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PushNotificationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
