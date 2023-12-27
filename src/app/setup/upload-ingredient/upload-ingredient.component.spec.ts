import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadIngredientComponent } from './upload-ingredient.component';

describe('UploadIngredientComponent', () => {
  let component: UploadIngredientComponent;
  let fixture: ComponentFixture<UploadIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadIngredientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
