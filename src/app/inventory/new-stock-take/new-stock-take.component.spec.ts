import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStockTakeComponent } from './new-stock-take.component';

describe('NewStockTakeComponent', () => {
  let component: NewStockTakeComponent;
  let fixture: ComponentFixture<NewStockTakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewStockTakeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStockTakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
