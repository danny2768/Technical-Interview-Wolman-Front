import { Pipe, PipeTransform } from '@angular/core';
import { Client } from '../interfaces/client.interface';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'searchClient'
})
export class SearchClientPipe implements PipeTransform {

  constructor(
    private datePipe: DatePipe
  ) {}

  transform(clients: Client[], searchText: string): Client[] {
    if (!clients || !searchText) {
      return clients;
    }
    searchText = searchText.toLowerCase();
    return clients.filter(client =>
      client.id.toLowerCase().includes(searchText) ||
      client.documentType.toLowerCase().includes(searchText) ||
      client.documentNumber.toLowerCase().includes(searchText) ||
      client.firstName.toLowerCase().includes(searchText) ||
      client.firstSurname.toLowerCase().includes(searchText) ||
      (client.secondName ? client.secondName.toLowerCase().includes(searchText) : false) ||
      (client.secondSurname ? client.secondSurname.toLowerCase().includes(searchText) : false) ||
      (this.datePipe.transform(client.birthDate, 'MMMM d, y') || '').toLowerCase().includes(searchText)

    );
  }
}
