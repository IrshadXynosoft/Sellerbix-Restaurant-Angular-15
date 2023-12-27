import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStockTakeComponent } from './view-stock-take.component';

describe('ViewStockTakeComponent', () => {
  let component: ViewStockTakeComponent;
  let fixture: ComponentFixture<ViewStockTakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStockTakeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStockTakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
