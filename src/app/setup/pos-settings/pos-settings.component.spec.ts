import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSettingsComponent } from './pos-settings.component';

describe('PosSettingsComponent', () => {
  let component: PosSettingsComponent;
  let fixture: ComponentFixture<PosSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
