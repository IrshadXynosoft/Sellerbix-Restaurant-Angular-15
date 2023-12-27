import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaybookSummaryComponent } from './daybook-summary.component';

describe('DaybookSummaryComponent', () => {
  let component: DaybookSummaryComponent;
  let fixture: ComponentFixture<DaybookSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaybookSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaybookSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
