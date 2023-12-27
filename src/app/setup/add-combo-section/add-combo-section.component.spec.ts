import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComboSectionComponent } from './add-combo-section.component';

describe('AddComboSectionComponent', () => {
  let component: AddComboSectionComponent;
  let fixture: ComponentFixture<AddComboSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddComboSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComboSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
