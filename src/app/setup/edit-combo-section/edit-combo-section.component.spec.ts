import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComboSectionComponent } from './edit-combo-section.component';

describe('EditComboSectionComponent', () => {
  let component: EditComboSectionComponent;
  let fixture: ComponentFixture<EditComboSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditComboSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComboSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
