import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubrecipesComponent } from './add-subrecipes.component';

describe('AddSubrecipesComponent', () => {
  let component: AddSubrecipesComponent;
  let fixture: ComponentFixture<AddSubrecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubrecipesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubrecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
