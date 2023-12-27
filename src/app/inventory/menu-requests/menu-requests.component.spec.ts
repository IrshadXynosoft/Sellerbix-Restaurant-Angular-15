import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRequestsComponent } from './menu-requests.component';

describe('MenuRequestsComponent', () => {
  let component: MenuRequestsComponent;
  let fixture: ComponentFixture<MenuRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
