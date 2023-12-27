import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsSettingsComponent } from './sms-settings.component';

describe('SmsSettingsComponent', () => {
  let component: SmsSettingsComponent;
  let fixture: ComponentFixture<SmsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
