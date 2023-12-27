import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIngredientCategoryComponent } from './add-ingredient-category.component';

describe('AddIngredientCategoryComponent', () => {
  let component: AddIngredientCategoryComponent;
  let fixture: ComponentFixture<AddIngredientCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIngredientCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIngredientCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
