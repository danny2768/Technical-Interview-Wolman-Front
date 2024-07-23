import { Client } from "./client.interface";

export interface CUD_Client { //Create, Update, Delete Client
  message: string;
  client:  Client;
}
