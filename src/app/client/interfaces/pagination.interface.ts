export interface Pagination {
  page:       number;
  limit:      number;
  totalItems: number;
  totalPages: number;
  next:       null;
  prev:       null;
  first:      string;
  last:       string;
}
