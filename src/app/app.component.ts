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
import { DeleteEntryDialogComponent } from './actions/delete-entry-dialog/delete-entry-dialog.component';

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
  displayedColumns: string[] = ['passportNo', 'name', 'date', 'commodity','actions'];
  dataSource = new MatTableDataSource<Entry>([]);
  searchField = new FormControl('passportNo');
  searchTerm = new FormControl('');
  entries: any[] = [];
  deferredPrompt:any;

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
        this.loadEntries(); // Reload entries to ensure data is up-to-date
      }
    });
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue
      ? filterValue.trim().toLowerCase()
      : '';
  }


  installPwa(){
    // Prompt the user to install the PWA (if supported)
    const nav = window.navigator as any;
    if ('standalone' in nav && nav.standalone) {
      // Already installed on iOS
      alert('This app is already installed on your device.');
      return;
    }

    // For iOS, show instructions since there is no install prompt
    if (/iphone|ipad|ipod/i.test(window.navigator.userAgent)) {
      alert(
        'To install this app on your iPad, tap the Share button in Safari and then "Add to Home Screen".'
      );
      return;
    }

    // For other platforms (Android, desktop), try to trigger the install prompt
    this.deferredPrompt = (window as any).deferredPrompt;
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then(() => {
        (window as any).deferredPrompt = null;
      });
    } else {
      alert('Install prompt is not available. Try using Chrome or Edge.');
    }
  }
  loadEntries() {
    this.entryService.getAllEntries().subscribe((entries) => {
      // Sort entries by date, newest first
      const sortedEntries = (entries as Entry[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.dataSource.data = sortedEntries;
      this.entries = sortedEntries;
    });
  }

  deleteEntry(entry:any) {
    this.entryService.deleteEntry(entry.id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter((e:any) => e.id !== entry.id);
      this.entries = this.entries.filter(e => e.id !== entry.id);
      this.applyFilter(this.searchTerm.value);
    });
  }
  
  openDeleteDialog(entry: any) {
    console.log('rgdb openDeleteDialog', entry);
    const dialogRef = this.dialog.open(DeleteEntryDialogComponent, {
      data: { ...entry },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteEntry(entry);
      }
    });
  }
  
}
