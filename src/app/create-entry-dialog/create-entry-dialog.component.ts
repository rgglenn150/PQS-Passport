// src/app/create-entry-dialog/create-entry-dialog.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EntryService } from '../entry.service';

@Component({
  selector: 'app-create-entry-dialog',
  templateUrl: './create-entry-dialog.component.html',
  styleUrls: ['./create-entry-dialog.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEntryDialogComponent {
  entryForm;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateEntryDialogComponent>,
    private entryService: EntryService
  ) {
    this.entryForm = this.fb.group({
      passportNo: ['', Validators.required],
      name: [''],
      date: [new Date(), Validators.required],
      commodity: [''],
    });
  }

  onSubmit() {
    if (this.entryForm.valid) {
      console.log('rgdb subom');
      this.entryService.addEntry(this.entryForm.value).subscribe(
        () => {
          this.dialogRef.close(true);
        },
        (err) => console.log(err)
      );
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
