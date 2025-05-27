import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateEntryDialogComponent } from './create-entry-dialog/create-entry-dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EntryService } from './entry.service';

interface Entry {
  passportNo: string;
  name: string;
  date: Date;
  commodity: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    CommonModule,
    MatSelectModule,
    MatToolbarModule,
  ],
})
export class AppComponent implements AfterViewInit {
  displayedColumns: string[] = ['passportNo', 'name', 'date', 'commodity'];
  dataSource = new MatTableDataSource<Entry>([]);
  searchField = new FormControl('passportNo');
  searchTerm = new FormControl('');
  entries: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog, private entryService: EntryService) {
    this.loadEntries();
  }

  ngAfterViewInit() {
    this.loadEntries();
    this.dataSource.paginator = this.paginator;

    // Update filter predicate for search by passportNo, name, or date
    this.dataSource.filterPredicate = (data: Entry, filter: string) => {
      const search = filter.toLowerCase();
      const field = this.searchField.value;

      if (!field) return false;

      if (field === 'passportNo') {
        return data.passportNo.toLowerCase().includes(search);
      }
      if (field === 'name') {
        return data.name.toLowerCase().includes(search);
      }
      if (field === 'date') {
        const d = new Date(data.date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // months are 0-based
        const day = d.getDate().toString().padStart(2, '0');

        const localDateStr = `${year}-${month}-${day}`;
        return localDateStr.includes(search);
      }

      return false;
    };

    // When search term or search field changes, filter the table
    this.searchTerm.valueChanges.subscribe((val: any) => {
      this.applyFilter(val);
    });
    this.searchField.valueChanges.subscribe(() => {
      this.applyFilter(this.searchTerm.value);
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateEntryDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Add new entry, reset paginator to first page
        this.dataSource.data = [...this.dataSource.data, result];
        this.paginator.firstPage();
        this.applyFilter(this.searchTerm.value);
      }
    });
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue
      ? filterValue.trim().toLowerCase()
      : '';
  }
  loadEntries() {
    this.entryService.getAllEntries().subscribe((entries) => {
      console.log('rgdb entried', entries);
      this.dataSource.data = entries as Entry[];
      this.entries = entries;
    });
  }
}
