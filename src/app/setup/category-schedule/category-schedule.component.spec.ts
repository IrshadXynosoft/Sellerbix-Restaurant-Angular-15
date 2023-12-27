import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryScheduleComponent } from './category-schedule.component';

describe('CategoryScheduleComponent', () => {
  let component: CategoryScheduleComponent;
  let fixture: ComponentFixture<CategoryScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
