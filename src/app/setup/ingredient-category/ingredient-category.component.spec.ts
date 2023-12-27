import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientCategoryComponent } from './ingredient-category.component';

describe('IngredientCategoryComponent', () => {
  let component: IngredientCategoryComponent;
  let fixture: ComponentFixture<IngredientCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
