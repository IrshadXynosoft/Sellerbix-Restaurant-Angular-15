import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmOrdersComponent } from './crm-orders.component';

describe('CrmOrdersComponent', () => {
  let component: CrmOrdersComponent;
  let fixture: ComponentFixture<CrmOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
