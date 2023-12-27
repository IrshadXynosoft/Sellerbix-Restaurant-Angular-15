import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMenuRequestComponent } from './new-menu-request.component';

describe('NewMenuRequestComponent', () => {
  let component: NewMenuRequestComponent;
  let fixture: ComponentFixture<NewMenuRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMenuRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMenuRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
