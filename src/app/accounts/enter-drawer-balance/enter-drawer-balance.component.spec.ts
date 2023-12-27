import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterDrawerBalanceComponent } from './enter-drawer-balance.component';

describe('EnterDrawerBalanceComponent', () => {
  let component: EnterDrawerBalanceComponent;
  let fixture: ComponentFixture<EnterDrawerBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterDrawerBalanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterDrawerBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
