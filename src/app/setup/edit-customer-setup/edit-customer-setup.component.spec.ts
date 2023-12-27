import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomerSetupComponent } from './edit-customer-setup.component';

describe('EditCustomerSetupComponent', () => {
  let component: EditCustomerSetupComponent;
  let fixture: ComponentFixture<EditCustomerSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCustomerSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomerSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
