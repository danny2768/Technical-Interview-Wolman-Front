import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { LayoutPageComponent } from './layout/layout-page/layout-page.component';
import { ClientListComponent } from './pages/client-list/client-list.component';
import { SharedModule } from "../shared/shared.module";
import { ClientFormModalComponent } from './components/client-form-modal/client-form-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchClientPipe } from './pipes/search-client.pipe';
import { SortByClientPipe } from './pipes/sort-by-client.pipe';


@NgModule({
  declarations: [
    LayoutPageComponent,
    ClientListComponent,
    ClientFormModalComponent,
    SearchClientPipe,
    SortByClientPipe
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    DatePipe,
  ]
})
export class ClientModule { }
