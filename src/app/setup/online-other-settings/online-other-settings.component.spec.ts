import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineOtherSettingsComponent } from './online-other-settings.component';

describe('OnlineOtherSettingsComponent', () => {
  let component: OnlineOtherSettingsComponent;
  let fixture: ComponentFixture<OnlineOtherSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineOtherSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineOtherSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
