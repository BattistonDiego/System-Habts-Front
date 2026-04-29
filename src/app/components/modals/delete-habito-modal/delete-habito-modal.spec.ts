import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHabitoModal } from './delete-habito-modal';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('DeleteHabitoModal', () => {
  let component: DeleteHabitoModal;
  let fixture: ComponentFixture<DeleteHabitoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteHabitoModal],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteHabitoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
