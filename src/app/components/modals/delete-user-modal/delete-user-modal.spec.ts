import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserModal } from './delete-user-modal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('DeleteUserModal', () => {
  let component: DeleteUserModal;
  let fixture: ComponentFixture<DeleteUserModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUserModal],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteUserModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
