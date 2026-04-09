import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-habito-modal',
  imports: [],
  templateUrl: './delete-habito-modal.html',
  styleUrl: './delete-habito-modal.scss',
})
export class DeleteHabitoModal {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DeleteHabitoModal>
  ) {}

  closeModal() {
    this.dialogRef.close();
  }

  excluirModal() {
    this.dialogRef.close(true);
  }
}
