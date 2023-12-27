import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeasurementUnitComponent } from './add-measurement-unit.component';

describe('AddMeasurementUnitComponent', () => {
  let component: AddMeasurementUnitComponent;
  let fixture: ComponentFixture<AddMeasurementUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMeasurementUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeasurementUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
