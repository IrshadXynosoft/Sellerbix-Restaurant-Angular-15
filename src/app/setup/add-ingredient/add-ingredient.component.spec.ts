import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIngredientComponent } from './add-ingredient.component';

describe('AddIngredientComponent', () => {
  let component: AddIngredientComponent;
  let fixture: ComponentFixture<AddIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIngredientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
