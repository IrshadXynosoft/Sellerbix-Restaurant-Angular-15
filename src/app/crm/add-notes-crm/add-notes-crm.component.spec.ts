import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotesCrmComponent } from './add-notes-crm.component';

describe('AddNotesCrmComponent', () => {
  let component: AddNotesCrmComponent;
  let fixture: ComponentFixture<AddNotesCrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNotesCrmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotesCrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
