import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUtensilsComponent } from './add-edit-utensils.component';

describe('AddEditUtensilsComponent', () => {
  let component: AddEditUtensilsComponent;
  let fixture: ComponentFixture<AddEditUtensilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditUtensilsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditUtensilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
