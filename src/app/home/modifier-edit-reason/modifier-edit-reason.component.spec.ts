import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierEditReasonComponent } from './modifier-edit-reason.component';

describe('ModifierEditReasonComponent', () => {
  let component: ModifierEditReasonComponent;
  let fixture: ComponentFixture<ModifierEditReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierEditReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierEditReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
