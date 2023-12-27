import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientEditComponent } from './ingredient-edit.component';

describe('IngredientEditComponent', () => {
  let component: IngredientEditComponent;
  let fixture: ComponentFixture<IngredientEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
