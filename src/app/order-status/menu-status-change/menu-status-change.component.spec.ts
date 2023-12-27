import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuStatusChangeComponent } from './menu-status-change.component';

describe('MenuStatusChangeComponent', () => {
  let component: MenuStatusChangeComponent;
  let fixture: ComponentFixture<MenuStatusChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuStatusChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuStatusChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
