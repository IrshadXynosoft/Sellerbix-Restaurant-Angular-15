import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModifierComponent } from './edit-modifier.component';

describe('EditModifierComponent', () => {
  let component: EditModifierComponent;
  let fixture: ComponentFixture<EditModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditModifierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
