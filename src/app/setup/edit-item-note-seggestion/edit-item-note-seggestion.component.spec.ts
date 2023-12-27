import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemNoteSeggestionComponent } from './edit-item-note-seggestion.component';

describe('EditItemNoteSeggestionComponent', () => {
  let component: EditItemNoteSeggestionComponent;
  let fixture: ComponentFixture<EditItemNoteSeggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditItemNoteSeggestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditItemNoteSeggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
