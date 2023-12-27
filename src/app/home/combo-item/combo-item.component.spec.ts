import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboItemComponent } from './combo-item.component';

describe('ComboItemComponent', () => {
  let component: ComboItemComponent;
  let fixture: ComponentFixture<ComboItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComboItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
