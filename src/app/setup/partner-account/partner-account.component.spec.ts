import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerAccountComponent } from './partner-account.component';

describe('PartnerAccountComponent', () => {
  let component: PartnerAccountComponent;
  let fixture: ComponentFixture<PartnerAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
