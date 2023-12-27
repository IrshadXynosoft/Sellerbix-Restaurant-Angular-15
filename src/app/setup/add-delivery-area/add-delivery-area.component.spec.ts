import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliveryAreaComponent } from './add-delivery-area.component';

describe('AddDeliveryAreaComponent', () => {
  let component: AddDeliveryAreaComponent;
  let fixture: ComponentFixture<AddDeliveryAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDeliveryAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeliveryAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
