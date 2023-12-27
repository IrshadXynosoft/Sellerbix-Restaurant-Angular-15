import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFinishedGoodsComponent } from './edit-finished-goods.component';

describe('EditFinishedGoodsComponent', () => {
  let component: EditFinishedGoodsComponent;
  let fixture: ComponentFixture<EditFinishedGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFinishedGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFinishedGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
