import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoryHeaderComponent } from './edit-category-header.component';

describe('EditCategoryHeaderComponent', () => {
  let component: EditCategoryHeaderComponent;
  let fixture: ComponentFixture<EditCategoryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCategoryHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategoryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
