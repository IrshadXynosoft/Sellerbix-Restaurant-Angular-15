import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoyaltyGroupComponent } from './add-loyalty-group.component';

describe('AddLoyaltyGroupComponent', () => {
  let component: AddLoyaltyGroupComponent;
  let fixture: ComponentFixture<AddLoyaltyGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLoyaltyGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLoyaltyGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
