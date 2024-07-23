import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Client } from '../../interfaces/client.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-client-form-modal',
  templateUrl: './client-form-modal.component.html',
  styleUrl: './client-form-modal.component.css'
})
export class ClientFormModalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  action!: 'create' | 'update';

  @Input()
  client?: Client;

  @Output()
  closeEvent = new EventEmitter<void>();

  public showForm: boolean = true;

  public dialogMessage = {
    title: 'Error',
    description: 'An error has occurred.',
  };

  public myForm: FormGroup = this.fb.group({
    documentType: ['', [ Validators.required ]],
    documentNumber: ['', [ Validators.required ]],
    firstName: ['', [ Validators.required ]],
    secondName: ['', [  ]],
    firstSurname: ['', [ Validators.required ]],
    secondSurname: ['', [  ]],
    birthDate: ['', [ Validators.required ]],
  });

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.action === 'update') {
      if (!this.client) {
        this.showForm = false;
        this.dialogMessage.description = 'Network not found.';
        return;
      }

      // Format the birthDate before patching it to the form
      const formattedClient = {
        ...this.client,
        birthDate: this.formatDate(this.client.birthDate.toString())
      };

      this.myForm.patchValue(formattedClient);
    }
  }

  // Utility method to format the date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD format
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      console.warn('Invalid form');
      return false;
    }

    let client = this.myForm.value as Client;

    if ( this.action === 'create' ) {
      this.createClient( client );
    }

    if ( this.action === 'update' ) {
      if ( !this.client ) {
        this.displayDialog('Error', 'Client not found.');
        return false;
      }

      client = { ...this.client, ...client };
      this.updateClient( client );
    }

    return false;
  }

  private createClient( client: Client): boolean {
    this.clientService.createClient( client ).pipe(takeUntil(this.destroy$)).subscribe({
      next: resp => {
        this.displayDialog('Success', 'Client created successfully.');
        this.myForm.reset();

        return true;
      },
      error: err => {
        if ( err.error.error ) {
          this.displayDialog('Error', err.error.error);
        } else {
          this.displayDialog('Error', 'An error occurred while creating the client. Please try again later.');
        }
        return false;
      }
    });

    return false;
  }

  private updateClient( client: Client): boolean {
    this.clientService.updateClient( client ).pipe(takeUntil(this.destroy$)).subscribe({
      next: resp => {
        this.displayDialog('Success', 'Client updated successfully.');
        this.myForm.reset();

        return true;
      },
      error: (err: HttpErrorResponse) => {
        if ( err.error.error ) {
          this.displayDialog('Error', err.error.error);
        } else {
          this.displayDialog('Error', 'An error occurred while updating the client. Please try again later.');
        }
        return false;
      }
    });

    return false;
  }

  onClose( ) {
    this.closeEvent.emit();
  }

  displayDialog( title: string, message: string):void {
    this.dialogMessage.title = title;
    this.dialogMessage.description = message;
    this.showForm = false;
  }

  // # Validaciones de campos
  isFieldInvalid(field: string): boolean | null {
    return (
      this.myForm.controls[field].errors && this.myForm.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    if (!this.myForm.controls[field]) return null;

    const errors = this.myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `Este campo es requerido`;
        case 'email':
          return `Debe ingresar un email para continuar`;
      }
    }
    return null;
  }
}
