import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubRecipesComponent } from './sub-recipes.component';

describe('SubRecipesComponent', () => {
  let component: SubRecipesComponent;
  let fixture: ComponentFixture<SubRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubRecipesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
