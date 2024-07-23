import { Address } from "./address.interface";

export interface Client {
  id:             string;
  documentType:   string;
  documentNumber: string;
  firstName:      string;
  firstSurname:   string;
  birthDate:      Date;
  addresses:      Address[];
  secondName?:    string;
  secondSurname?: string;
}
