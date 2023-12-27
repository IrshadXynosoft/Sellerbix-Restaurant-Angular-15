import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComboComponent } from './add-combo.component';

describe('AddComboComponent', () => {
  let component: AddComboComponent;
  let fixture: ComponentFixture<AddComboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddComboComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
