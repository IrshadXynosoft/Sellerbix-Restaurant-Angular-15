import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboSectionsComponent } from './combo-sections.component';

describe('ComboSectionsComponent', () => {
  let component: ComboSectionsComponent;
  let fixture: ComponentFixture<ComboSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComboSectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
