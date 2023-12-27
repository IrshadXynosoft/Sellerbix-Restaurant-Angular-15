import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableReservationComponent } from './table-reservation.component';

describe('TableReservationComponent', () => {
  let component: TableReservationComponent;
  let fixture: ComponentFixture<TableReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableReservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
