import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-entry-dialog',
  templateUrl: './delete-entry-dialog.component.html',
  styleUrls: ['./delete-entry-dialog.component.scss'],
  imports: [MatButtonModule,MatDialogModule,CommonModule],
})
export class DeleteEntryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string ,passportNo:string, commodity:string, date:Date, id:string } 
  ) {
    console.log('rgdb ',data)
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.dialogRef.close(true);
  }
}
