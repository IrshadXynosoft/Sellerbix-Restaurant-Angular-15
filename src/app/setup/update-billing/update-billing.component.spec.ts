import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBillingComponent } from './update-billing.component';

describe('UpdateBillingComponent', () => {
  let component: UpdateBillingComponent;
  let fixture: ComponentFixture<UpdateBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBillingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
