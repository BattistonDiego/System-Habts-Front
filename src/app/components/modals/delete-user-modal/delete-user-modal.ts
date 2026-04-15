import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../interface/user.model';

@Component({
  selector: 'app-delete-user-modal',
  imports: [],
  templateUrl: './delete-user-modal.html',
  styleUrl: './delete-user-modal.scss',
})
export class DeleteUserModal {
  constructor(
    private dialogRef: MatDialogRef<DeleteUserModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  closeModal() {
    this.dialogRef.close();
  }

  deleteUser() {
    this.dialogRef.close(true);
  }
}
