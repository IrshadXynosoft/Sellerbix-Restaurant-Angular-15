import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewCustomerComponent } from './create-new-customer.component';

describe('CreateNewCustomerComponent', () => {
  let component: CreateNewCustomerComponent;
  let fixture: ComponentFixture<CreateNewCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
