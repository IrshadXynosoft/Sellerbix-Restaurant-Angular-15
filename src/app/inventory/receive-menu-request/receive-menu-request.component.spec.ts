import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveMenuRequestComponent } from './receive-menu-request.component';

describe('ReceiveMenuRequestComponent', () => {
  let component: ReceiveMenuRequestComponent;
  let fixture: ComponentFixture<ReceiveMenuRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveMenuRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveMenuRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
