import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityOrdersComponent } from './entity-orders.component';

describe('EntityOrdersComponent', () => {
  let component: EntityOrdersComponent;
  let fixture: ComponentFixture<EntityOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
