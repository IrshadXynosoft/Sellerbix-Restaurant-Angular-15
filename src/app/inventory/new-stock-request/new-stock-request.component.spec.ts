import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStockRequestComponent } from './new-stock-request.component';

describe('NewStockRequestComponent', () => {
  let component: NewStockRequestComponent;
  let fixture: ComponentFixture<NewStockRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewStockRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStockRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
