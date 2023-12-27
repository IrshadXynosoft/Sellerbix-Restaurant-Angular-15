import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingExpensesComponent } from './adding-expenses.component';

describe('AddingExpensesComponent', () => {
  let component: AddingExpensesComponent;
  let fixture: ComponentFixture<AddingExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddingExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddingExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
