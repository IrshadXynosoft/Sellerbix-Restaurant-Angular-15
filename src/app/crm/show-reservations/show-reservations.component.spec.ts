import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowReservationsComponent } from './show-reservations.component';

describe('ShowReservationsComponent', () => {
  let component: ShowReservationsComponent;
  let fixture: ComponentFixture<ShowReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowReservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
