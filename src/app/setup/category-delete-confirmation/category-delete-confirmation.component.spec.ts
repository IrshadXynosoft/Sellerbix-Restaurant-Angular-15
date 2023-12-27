import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDeleteConfirmationComponent } from './category-delete-confirmation.component';

describe('CategoryDeleteConfirmationComponent', () => {
  let component: CategoryDeleteConfirmationComponent;
  let fixture: ComponentFixture<CategoryDeleteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryDeleteConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryDeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
