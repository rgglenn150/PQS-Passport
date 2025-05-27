// src/app/services/entry.service.ts
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  constructor(private dbService: NgxIndexedDBService) {}

  addEntry(entry: any) {
    return this.dbService.add('entries', entry);
  }

  getAllEntries() {
    return this.dbService.getAll('entries');
  }

  deleteEntry(id: number) {
    return this.dbService.delete('entries', id);
  }
}
