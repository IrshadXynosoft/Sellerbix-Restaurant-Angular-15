import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerMenuComponent } from './inner-menu.component';

describe('InnerMenuComponent', () => {
  let component: InnerMenuComponent;
  let fixture: ComponentFixture<InnerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnerMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
