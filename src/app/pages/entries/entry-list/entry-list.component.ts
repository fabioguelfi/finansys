import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {

  public entries: Entry[] = [];

  constructor(private entryService: EntryService) { }

  public ngOnInit(): void {
    this.entryService.getAll()
      .subscribe(
        entries => this.entries = [...entries],
        error => console.log(error),
        () => { }
      )
  }

  public deleteEntry({ id }: Entry): void {
    const mustDelete = confirm('Deseja realmente excluir este item?');
    if (!mustDelete) return
    this.entryService.delete(id).subscribe(
      () => this.entries = this.entries.filter(i => i.id != id),
      () => alert(`error`)
    )
  }

}
