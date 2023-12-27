import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffHistoryComponent } from './staff-history.component';

describe('StaffHistoryComponent', () => {
  let component: StaffHistoryComponent;
  let fixture: ComponentFixture<StaffHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
