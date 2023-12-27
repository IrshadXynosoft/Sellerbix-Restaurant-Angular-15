import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSurchargeComponent } from './add-surcharge.component';

describe('AddSurchargeComponent', () => {
  let component: AddSurchargeComponent;
  let fixture: ComponentFixture<AddSurchargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSurchargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSurchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
