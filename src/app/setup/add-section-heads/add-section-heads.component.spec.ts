import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSectionHeadsComponent } from './add-section-heads.component';

describe('AddSectionHeadsComponent', () => {
  let component: AddSectionHeadsComponent;
  let fixture: ComponentFixture<AddSectionHeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSectionHeadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSectionHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
