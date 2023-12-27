import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedgoodEditComponent } from './finishedgood-edit.component';

describe('FinishedgoodEditComponent', () => {
  let component: FinishedgoodEditComponent;
  let fixture: ComponentFixture<FinishedgoodEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishedgoodEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishedgoodEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
