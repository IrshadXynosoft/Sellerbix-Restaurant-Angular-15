import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemNoteSeggestionComponent } from './item-note-seggestion.component';

describe('ItemNoteSeggestionComponent', () => {
  let component: ItemNoteSeggestionComponent;
  let fixture: ComponentFixture<ItemNoteSeggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemNoteSeggestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemNoteSeggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
