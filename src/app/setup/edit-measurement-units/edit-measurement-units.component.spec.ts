import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMeasurementUnitsComponent } from './edit-measurement-units.component';

describe('EditMeasurementUnitsComponent', () => {
  let component: EditMeasurementUnitsComponent;
  let fixture: ComponentFixture<EditMeasurementUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMeasurementUnitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMeasurementUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
