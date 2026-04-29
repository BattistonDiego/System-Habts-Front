import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSnackbar } from './custom-snackbar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
describe('CustomSnackbar', () => {
  let component: CustomSnackbar;
  let fixture: ComponentFixture<CustomSnackbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSnackbar],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSnackbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
