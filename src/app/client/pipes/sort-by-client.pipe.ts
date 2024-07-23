import { Pipe, PipeTransform } from '@angular/core';
import { Client } from '../interfaces/client.interface';


@Pipe({
  name: 'sortByClient'
})
export class SortByClientPipe implements PipeTransform {

  transform(clients: Client[], sortBy?: keyof Client): Client[] {
    switch (sortBy) {
      case 'id':
        return clients.sort((a, b) => (a.id > b.id ? 1 : -1));

      case 'documentType':
        return clients.sort((a, b) => (a.documentType > b.documentType ? 1 : -1));

      case 'documentNumber':
        return clients.sort((a, b) => (a.documentNumber > b.documentNumber ? 1 : -1));

      case 'firstName':
        return clients.sort((a, b) => (a.firstName > b.firstName ? 1 : -1));

      case 'firstSurname':
        return clients.sort((a, b) => (a.firstSurname > b.firstSurname ? 1 : -1));

      case 'birthDate':
        return clients.sort((a, b) => (a.birthDate > b.birthDate ? 1 : -1));

      default:
        return clients;
    }
  }
}
