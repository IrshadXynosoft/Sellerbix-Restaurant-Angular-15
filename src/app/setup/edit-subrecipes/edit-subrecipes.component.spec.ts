import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubrecipesComponent } from './edit-subrecipes.component';

describe('EditSubrecipesComponent', () => {
  let component: EditSubrecipesComponent;
  let fixture: ComponentFixture<EditSubrecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSubrecipesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubrecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
