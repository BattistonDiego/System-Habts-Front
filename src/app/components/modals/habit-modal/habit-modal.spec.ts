import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitModal } from './habit-modal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('HabitModal', () => {
  let component: HabitModal;
  let fixture: ComponentFixture<HabitModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitModal],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
