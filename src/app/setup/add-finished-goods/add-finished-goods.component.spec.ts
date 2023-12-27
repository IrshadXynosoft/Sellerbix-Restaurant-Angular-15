import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFinishedGoodsComponent } from './add-finished-goods.component';

describe('AddFinishedGoodsComponent', () => {
  let component: AddFinishedGoodsComponent;
  let fixture: ComponentFixture<AddFinishedGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFinishedGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFinishedGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
