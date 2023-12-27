import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeOrderComponent } from './qrcode-order.component';

describe('QrcodeOrderComponent', () => {
  let component: QrcodeOrderComponent;
  let fixture: ComponentFixture<QrcodeOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodeOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrcodeOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
