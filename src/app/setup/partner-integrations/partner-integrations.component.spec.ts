import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerIntegrationsComponent } from './partner-integrations.component';

describe('PartnerIntegrationsComponent', () => {
  let component: PartnerIntegrationsComponent;
  let fixture: ComponentFixture<PartnerIntegrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerIntegrationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
