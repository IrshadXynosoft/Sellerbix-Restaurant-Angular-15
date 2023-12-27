import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTableReservationsComponent } from './edit-table-reservations.component';

describe('EditTableReservationsComponent', () => {
  let component: EditTableReservationsComponent;
  let fixture: ComponentFixture<EditTableReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTableReservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTableReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
