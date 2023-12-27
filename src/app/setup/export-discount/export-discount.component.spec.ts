import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDiscountComponent } from './export-discount.component';

describe('ExportDiscountComponent', () => {
  let component: ExportDiscountComponent;
  let fixture: ComponentFixture<ExportDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportDiscountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
