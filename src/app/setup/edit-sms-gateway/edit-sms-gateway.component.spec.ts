import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSmsGatewayComponent } from './edit-sms-gateway.component';

describe('EditSmsGatewayComponent', () => {
  let component: EditSmsGatewayComponent;
  let fixture: ComponentFixture<EditSmsGatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSmsGatewayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSmsGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
