export type CustomerStatus = 'Active' | 'Inactive' | 'Pending' | 'Lead';

export type CustomerDepartment =
  | 'Engineering'
  | 'Sales'
  | 'Marketing'
  | 'Support'
  | 'Finance'
  | 'Operations'
  | 'Product';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: CustomerDepartment;
  status: CustomerStatus;
  notes?: string;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

export type CustomerFormData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: CustomerDepartment;
  status: CustomerStatus;
  notes?: string;
};

export type CustomerFormErrors = Partial<Record<keyof CustomerFormData, string>>;

export type SortField = 'id' | 'name' | 'email' | 'department' | 'status' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface CustomerFiltersState {
  searchQuery: string;
  status: CustomerStatus | 'ALL';
  department: CustomerDepartment | 'ALL';
}

export interface CustomerSortState {
  field: SortField;
  order: SortOrder;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}
