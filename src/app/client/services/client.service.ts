import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClientResponse } from '../interfaces/client-resp.interface';
import { Client } from '../interfaces/client.interface';
import { CUD_Client } from '../interfaces/CUD-client-resp.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = environments.baseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  public saveToLocalStorage(key: string, value: any) {
    localStorage.setItem( key, JSON.stringify(value) );
  }

  public getFromLocalStorage(key: string) {
    return JSON.parse( localStorage.getItem(key) || 'null' );
  }

  // # Client requests

  getClients( page: number = 1, limit: number = 10 ) {
    return this.http.get<ClientResponse>(`${this.baseUrl}/api/clients?page=${page}&limit=${limit}`);
  }

  getClientById( id: string ) {
    return this.http.get<Client>(`${this.baseUrl}/api/clients/${id}`);
  }

  createClient( client: Client ) {
    return this.http.post<CUD_Client>(`${this.baseUrl}/api/clients`, client);
  }

  updateClient( client: Client ) {
    return this.http.put<CUD_Client>(`${this.baseUrl}/api/clients/${client.id}`, client);
  }

  deleteClient( id: string ) {
    return this.http.delete<CUD_Client>(`${this.baseUrl}/api/clients/${id}`);
  }


}
