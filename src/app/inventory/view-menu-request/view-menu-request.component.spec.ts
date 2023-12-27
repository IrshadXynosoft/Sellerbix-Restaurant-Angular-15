import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMenuRequestComponent } from './view-menu-request.component';

describe('ViewMenuRequestComponent', () => {
  let component: ViewMenuRequestComponent;
  let fixture: ComponentFixture<ViewMenuRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMenuRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMenuRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
