import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTablesModalComponent } from './list-tables-modal.component';

describe('ListTablesModalComponent', () => {
  let component: ListTablesModalComponent;
  let fixture: ComponentFixture<ListTablesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTablesModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTablesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
