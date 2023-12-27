import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTransferComponent } from './menu-transfer.component';

describe('MenuTransferComponent', () => {
  let component: MenuTransferComponent;
  let fixture: ComponentFixture<MenuTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
