import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockTakeComponent } from './edit-stock-take.component';

describe('EditStockTakeComponent', () => {
  let component: EditStockTakeComponent;
  let fixture: ComponentFixture<EditStockTakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStockTakeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStockTakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
