import { Client } from "./client.interface";
import { Pagination } from "./pagination.interface";

export interface ClientResponse {
  pagination: Pagination;
  clients:    Client[];
}
