import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrinterComponent } from './add-printer.component';

describe('AddPrinterComponent', () => {
  let component: AddPrinterComponent;
  let fixture: ComponentFixture<AddPrinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPrinterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
