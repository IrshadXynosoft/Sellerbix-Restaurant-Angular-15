import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitBillComponent } from './split-bill.component';

describe('SplitBillComponent', () => {
  let component: SplitBillComponent;
  let fixture: ComponentFixture<SplitBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SplitBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
