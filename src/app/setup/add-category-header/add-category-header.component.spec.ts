import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryHeaderComponent } from './add-category-header.component';

describe('AddCategoryHeaderComponent', () => {
  let component: AddCategoryHeaderComponent;
  let fixture: ComponentFixture<AddCategoryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCategoryHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
