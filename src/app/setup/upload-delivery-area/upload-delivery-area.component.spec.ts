import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDeliveryAreaComponent } from './upload-delivery-area.component';

describe('UploadDeliveryAreaComponent', () => {
  let component: UploadDeliveryAreaComponent;
  let fixture: ComponentFixture<UploadDeliveryAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDeliveryAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDeliveryAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
