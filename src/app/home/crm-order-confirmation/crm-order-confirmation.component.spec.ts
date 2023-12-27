import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmOrderConfirmationComponent } from './crm-order-confirmation.component';

describe('CrmOrderConfirmationComponent', () => {
  let component: CrmOrderConfirmationComponent;
  let fixture: ComponentFixture<CrmOrderConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmOrderConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmOrderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
