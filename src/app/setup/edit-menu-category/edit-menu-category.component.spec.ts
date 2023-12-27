import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMenuCategoryComponent } from './edit-menu-category.component';

describe('EditMenuCategoryComponent', () => {
  let component: EditMenuCategoryComponent;
  let fixture: ComponentFixture<EditMenuCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMenuCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMenuCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
