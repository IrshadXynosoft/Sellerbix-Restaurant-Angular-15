import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCustomerDetailsComponent } from './show-customer-details.component';

describe('ShowCustomerDetailsComponent', () => {
  let component: ShowCustomerDetailsComponent;
  let fixture: ComponentFixture<ShowCustomerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCustomerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
