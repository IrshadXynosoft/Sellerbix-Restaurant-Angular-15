import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewConsignmentOrderComponent } from './new-consignment-order.component';

describe('NewConsignmentOrderComponent', () => {
  let component: NewConsignmentOrderComponent;
  let fixture: ComponentFixture<NewConsignmentOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewConsignmentOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewConsignmentOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
