import { Client } from "./client.interface";

export interface FormDialogInfo {
  showdialog: boolean;
  title: string;
  action: 'create' | 'update';
  client?: Client;
}
