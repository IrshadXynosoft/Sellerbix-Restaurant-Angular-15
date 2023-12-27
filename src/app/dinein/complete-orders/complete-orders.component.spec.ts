import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteOrdersComponent } from './complete-orders.component';

describe('CompleteOrdersComponent', () => {
  let component: CompleteOrdersComponent;
  let fixture: ComponentFixture<CompleteOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
