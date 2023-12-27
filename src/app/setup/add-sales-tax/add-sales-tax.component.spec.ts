import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesTaxComponent } from './add-sales-tax.component';

describe('AddSalesTaxComponent', () => {
  let component: AddSalesTaxComponent;
  let fixture: ComponentFixture<AddSalesTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSalesTaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
