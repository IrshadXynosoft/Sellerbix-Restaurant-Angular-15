import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCrmDetailsComponent } from './show-crm-details.component';

describe('ShowCrmDetailsComponent', () => {
  let component: ShowCrmDetailsComponent;
  let fixture: ComponentFixture<ShowCrmDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowCrmDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCrmDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
