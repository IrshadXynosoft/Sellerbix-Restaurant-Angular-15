import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineOrderComponent } from './online-order.component';

describe('OnlineOrderComponent', () => {
  let component: OnlineOrderComponent;
  let fixture: ComponentFixture<OnlineOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
