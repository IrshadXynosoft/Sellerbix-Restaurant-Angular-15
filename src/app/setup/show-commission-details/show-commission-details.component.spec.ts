import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCommissionDetailsComponent } from './show-commission-details.component';

describe('ShowCommissionDetailsComponent', () => {
  let component: ShowCommissionDetailsComponent;
  let fixture: ComponentFixture<ShowCommissionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCommissionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCommissionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
