import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyOrdersComponent } from './party-orders.component';

describe('PartyOrdersComponent', () => {
  let component: PartyOrdersComponent;
  let fixture: ComponentFixture<PartyOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
