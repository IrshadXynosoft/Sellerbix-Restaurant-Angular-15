import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSurchargeComponent } from './edit-surcharge.component';

describe('EditSurchargeComponent', () => {
  let component: EditSurchargeComponent;
  let fixture: ComponentFixture<EditSurchargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSurchargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSurchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
