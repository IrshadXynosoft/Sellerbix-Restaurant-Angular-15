import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDineinMultipleOrdersComponent } from './show-dinein-multiple-orders.component';

describe('ShowDineinMultipleOrdersComponent', () => {
  let component: ShowDineinMultipleOrdersComponent;
  let fixture: ComponentFixture<ShowDineinMultipleOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowDineinMultipleOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowDineinMultipleOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
