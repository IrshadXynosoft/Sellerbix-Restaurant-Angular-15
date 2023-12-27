import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomEntityDialogComponent } from './custom-entity-dialog.component';

describe('CustomEntityDialogComponent', () => {
  let component: CustomEntityDialogComponent;
  let fixture: ComponentFixture<CustomEntityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomEntityDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomEntityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
