import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedReceiptComponent } from './approved-receipt.component';

describe('ApprovedReceiptComponent', () => {
  let component: ApprovedReceiptComponent;
  let fixture: ComponentFixture<ApprovedReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
