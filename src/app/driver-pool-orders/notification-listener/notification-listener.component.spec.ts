import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationListenerComponent } from './notification-listener.component';

describe('NotificationListenerComponent', () => {
  let component: NotificationListenerComponent;
  let fixture: ComponentFixture<NotificationListenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationListenerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationListenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
