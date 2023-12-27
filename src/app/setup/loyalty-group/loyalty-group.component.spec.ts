import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyGroupComponent } from './loyalty-group.component';

describe('LoyaltyGroupComponent', () => {
  let component: LoyaltyGroupComponent;
  let fixture: ComponentFixture<LoyaltyGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoyaltyGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyaltyGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
