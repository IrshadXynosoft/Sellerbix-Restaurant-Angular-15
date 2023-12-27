import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineSettingsComponent } from './online-settings.component';

describe('OnlineSettingsComponent', () => {
  let component: OnlineSettingsComponent;
  let fixture: ComponentFixture<OnlineSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
