import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryGlobalSettingsComponent } from './inventory-global-settings.component';

describe('InventoryGlobalSettingsComponent', () => {
  let component: InventoryGlobalSettingsComponent;
  let fixture: ComponentFixture<InventoryGlobalSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryGlobalSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryGlobalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
