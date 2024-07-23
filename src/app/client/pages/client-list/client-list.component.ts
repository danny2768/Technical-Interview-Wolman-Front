import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Client } from '../../interfaces/client.interface';
import { Pagination } from '../../interfaces/pagination.interface';
import { ClientService } from '../../services/client.service';
import { FormDialogInfo } from '../../interfaces/form-dialog-info.interface';
import { YesNoDialogOptions } from '../../interfaces/yes-no-dialog-options.interface';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  public loadComplete: boolean = false;
  public clients: Client[] = [];
  public pagination?: Pagination;
  public limit: 10 | 25 | 50 | 100 = 10;

  public orderby: keyof Client = 'id';
  public searchText: string = '';

  public dialogInfo = {
    showDialog: false,
    title: '',
    description: ''
  };

  public yesNoDialogInfo = {
    showDialog: false,
    title: '',
    description: '',
    acceptButtonText: '',
    discardButtonText: '',
    acceptEvent: () => {},
    discardEvent: () => {},
  };

  public formDialogInfo: FormDialogInfo = {
    showdialog: false,
    title: '',
    action: 'create',
  }

  constructor(
    private clientService: ClientService,
  ) {}


  ngOnInit(): void {
    this.loadClients();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClients( page: number = 1, limit: number = 10 ) {
    this.clientService.getClients( page, limit ).subscribe({
      next: resp => {
        this.clients = resp.clients;
        this.pagination = resp.pagination;

        this.loadComplete = true;
      },
      error: err => {
        this.displayDialog('Error', 'An error occurred while loading the clients. Please try again later.');
      }
    });
  }

  onDeleteClient( clientId: string ): void {
    this.displayYesNoDialog({
      title: 'Delete client',
      description: 'Are you sure you want to delete this client?',
      acceptButtonText: 'Yes',
      discardButtonText: 'No',
      acceptEvent: () => this.deleteClient(clientId),
      discardEvent: () => this.closeYesNoDialog()
    });
  }

  deleteClient( clientId: string ): void {
    this.clientService.deleteClient( clientId ).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.closeYesNoDialog();
        this.displayDialog('Success', 'Client deleted successfully')
        this.loadClients();
      },
      error: err => {
        this.closeYesNoDialog();
        if ( err.error.error ) {
          this.displayDialog('Error', err.error.error);
        } else {
          this.displayDialog('Error', 'An error occurred while deleting the client. Please try again later.');
        }
      }
    });
  }

  // # Pagination methods
  changeLimit(newLimit: 10 | 25 | 50 | 100 ): void {
    this.limit = newLimit;
    this.loadClients( 1, this.limit );

    this.closeDropdown(['limitDropdown'])
  }

  nextPage(): void {
    if (this.pagination && this.pagination.next) {
      this.loadClients(this.pagination.page + 1, this.limit);
    }
  }

  prevPage(): void {
    if (this.pagination && this.pagination.prev) {
      this.loadClients(this.pagination.page - 1, this.limit);
    }
  }

  firstPage(): void {
    this.loadClients(1, this.limit);
  }

  lastPage(): void {
    if (this.pagination) {
      this.loadClients(this.pagination.totalPages, this.limit);
    }
  }

  // # Modal dialog methods
  displayDialog( title: string, description: string): void {
    this.dialogInfo = {
      showDialog: true,
      title,
      description
    }
  }

  displayYesNoDialog( options: YesNoDialogOptions ): void {
    this.yesNoDialogInfo = {
      showDialog: true,
      ...options
    }
  }

  displayFormDialog( action: 'create' | 'update', client?: Client ): void {
    if (action === 'update') {
      this.formDialogInfo.title = 'Update client';
      this.formDialogInfo.client = client;
    } else {
      this.formDialogInfo.title = 'Create client';
      this.formDialogInfo.client = undefined;
    }

    this.formDialogInfo.action = action;
    this.formDialogInfo.showdialog = true;
  }

  closeDialog(): void {
    this.dialogInfo.showDialog = false;
  }

  closeYesNoDialog(): void {
    this.yesNoDialogInfo.showDialog = false;
  }

  closeFormDialog(): void {
    this.formDialogInfo.showdialog = false;
    this.loadClients( this.pagination?.page, this.pagination?.limit );
  }

  // # Other methods
  closeDropdown( dropdownIds: string[] ): void {
    dropdownIds.forEach(dropdownId => {
      document.getElementById(dropdownId)?.removeAttribute('open');
    });
  }

  changeOrder( value: keyof Client ): void {
    this.orderby = value;

    this.closeDropdown(['filterDropdown'])
  }
}
