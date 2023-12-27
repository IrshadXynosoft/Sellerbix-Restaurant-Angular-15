import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyReasonComponent } from './modify-reason.component';

describe('ModifyReasonComponent', () => {
  let component: ModifyReasonComponent;
  let fixture: ComponentFixture<ModifyReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
