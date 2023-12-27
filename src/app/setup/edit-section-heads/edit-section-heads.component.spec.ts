import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSectionHeadsComponent } from './edit-section-heads.component';

describe('EditSectionHeadsComponent', () => {
  let component: EditSectionHeadsComponent;
  let fixture: ComponentFixture<EditSectionHeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSectionHeadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSectionHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
