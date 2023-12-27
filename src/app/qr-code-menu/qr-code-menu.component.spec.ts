import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRCodeMenuComponent } from './qr-code-menu.component';

describe('QRCodeMenuComponent', () => {
  let component: QRCodeMenuComponent;
  let fixture: ComponentFixture<QRCodeMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QRCodeMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QRCodeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
