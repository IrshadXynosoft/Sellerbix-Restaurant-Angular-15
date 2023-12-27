import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDriverPoolOrdersComponent } from './request-driver-pool-orders.component';

describe('RequestDriverPoolOrdersComponent', () => {
  let component: RequestDriverPoolOrdersComponent;
  let fixture: ComponentFixture<RequestDriverPoolOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestDriverPoolOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDriverPoolOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
