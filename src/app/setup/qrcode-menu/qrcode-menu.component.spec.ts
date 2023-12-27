import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeMenuComponent } from './qrcode-menu.component';

describe('QrcodeMenuComponent', () => {
  let component: QrcodeMenuComponent;
  let fixture: ComponentFixture<QrcodeMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodeMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrcodeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
