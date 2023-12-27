import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmAddressLabelsComponent } from './crm-address-labels.component';

describe('CrmAddressLabelsComponent', () => {
  let component: CrmAddressLabelsComponent;
  let fixture: ComponentFixture<CrmAddressLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmAddressLabelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmAddressLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
