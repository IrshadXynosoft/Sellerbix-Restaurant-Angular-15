import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityOrdersCancellationComponent } from './entity-orders-cancellation.component';

describe('EntityOrdersCancellationComponent', () => {
  let component: EntityOrdersCancellationComponent;
  let fixture: ComponentFixture<EntityOrdersCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityOrdersCancellationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityOrdersCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
