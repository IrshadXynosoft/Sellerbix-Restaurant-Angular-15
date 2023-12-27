import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkinComponent } from './walkin.component';

describe('WalkinComponent', () => {
  let component: WalkinComponent;
  let fixture: ComponentFixture<WalkinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalkinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
