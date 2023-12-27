import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtpSettingsComponent } from './smtp-settings.component';

describe('SmtpSettingsComponent', () => {
  let component: SmtpSettingsComponent;
  let fixture: ComponentFixture<SmtpSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtpSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmtpSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
