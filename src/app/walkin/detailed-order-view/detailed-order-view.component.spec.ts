import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedOrderViewComponent } from './detailed-order-view.component';

describe('DetailedOrderViewComponent', () => {
  let component: DetailedOrderViewComponent;
  let fixture: ComponentFixture<DetailedOrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedOrderViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
