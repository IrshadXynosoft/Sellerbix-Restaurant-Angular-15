import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverpoolReportsComponent } from './driverpool-reports.component';

describe('DriverpoolReportsComponent', () => {
  let component: DriverpoolReportsComponent;
  let fixture: ComponentFixture<DriverpoolReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverpoolReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverpoolReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
