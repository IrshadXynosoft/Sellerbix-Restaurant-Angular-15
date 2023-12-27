import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedGoodsComponent } from './finished-goods.component';

describe('FinishedGoodsComponent', () => {
  let component: FinishedGoodsComponent;
  let fixture: ComponentFixture<FinishedGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishedGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
