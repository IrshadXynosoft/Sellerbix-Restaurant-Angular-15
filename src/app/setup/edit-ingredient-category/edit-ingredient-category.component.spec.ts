import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIngredientCategoryComponent } from './edit-ingredient-category.component';

describe('EditIngredientCategoryComponent', () => {
  let component: EditIngredientCategoryComponent;
  let fixture: ComponentFixture<EditIngredientCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIngredientCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIngredientCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
