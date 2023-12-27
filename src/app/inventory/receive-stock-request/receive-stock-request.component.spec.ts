import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveStockRequestComponent } from './receive-stock-request.component';

describe('ReceiveStockRequestComponent', () => {
  let component: ReceiveStockRequestComponent;
  let fixture: ComponentFixture<ReceiveStockRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveStockRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveStockRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
