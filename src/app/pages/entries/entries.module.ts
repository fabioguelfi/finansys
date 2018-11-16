import { NgModule } from '@angular/core';
import { EntriesRoutingModule } from './entries-routing.module';
import { EntryListComponent } from './entry-list/entry-list.component';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { CalendarModule } from 'primeng/calendar';
import { IMaskModule } from "angular-imask";
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    EntriesRoutingModule,
    IMaskModule,
    CalendarModule,
  ],
  declarations: [
    EntryListComponent,
    EntryFormComponent
  ]
})
export class EntriesModule { }
