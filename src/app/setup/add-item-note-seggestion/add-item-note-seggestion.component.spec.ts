import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemNoteSeggestionComponent } from './add-item-note-seggestion.component';

describe('AddItemNoteSeggestionComponent', () => {
  let component: AddItemNoteSeggestionComponent;
  let fixture: ComponentFixture<AddItemNoteSeggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemNoteSeggestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemNoteSeggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
