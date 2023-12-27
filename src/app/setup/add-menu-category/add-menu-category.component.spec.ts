import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMenuCategoryComponent } from './add-menu-category.component';

describe('AddMenuCategoryComponent', () => {
  let component: AddMenuCategoryComponent;
  let fixture: ComponentFixture<AddMenuCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMenuCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMenuCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
