import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionStatusDialogComponent } from './subscription-status-dialog.component';

describe('SubscriptionStatusDialogComponent', () => {
  let component: SubscriptionStatusDialogComponent;
  let fixture: ComponentFixture<SubscriptionStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionStatusDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
