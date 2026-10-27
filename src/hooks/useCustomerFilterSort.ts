import { useState, useMemo, useCallback } from 'react';
import {
  Customer,
  CustomerDepartment,
  CustomerStatus,
  SortField,
  SortOrder,
} from '../types/customer';

interface UseCustomerFilterSortProps {
  customers: Customer[];
  initialPageSize?: number;
}

export function useCustomerFilterSort({
  customers,
  initialPageSize = 5,
}: UseCustomerFilterSortProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'ALL'>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<CustomerDepartment | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Check if any filter is active
  const isFiltered = useMemo(() => {
    return (
      searchQuery.trim().length > 0 ||
      statusFilter !== 'ALL' ||
      departmentFilter !== 'ALL'
    );
  }, [searchQuery, statusFilter, departmentFilter]);

  // Reset all filters and search query
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setDepartmentFilter('ALL');
    setCurrentPage(1);
  }, []);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return customers.filter((customer) => {
      // 1. Search Query matches name, email, or ID
      if (query) {
        const matchesName = customer.name.toLowerCase().includes(query);
        const matchesEmail = customer.email.toLowerCase().includes(query);
        const matchesId = customer.id.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesId) {
          return false;
        }
      }

      // 2. Status filter
      if (statusFilter !== 'ALL' && customer.status !== statusFilter) {
        return false;
      }

      // 3. Department filter
      if (departmentFilter !== 'ALL' && customer.department !== departmentFilter) {
        return false;
      }

      return true;
    });
  }, [customers, searchQuery, statusFilter, departmentFilter]);

  // Sorted customers
  const sortedCustomers = useMemo(() => {
    const list = [...filteredCustomers];

    list.sort((a, b) => {
      let valA: string = (a[sortField] || '').toLowerCase();
      let valB: string = (b[sortField] || '').toLowerCase();

      // For date fields, compare timestamps
      if (sortField === 'createdAt') {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }

      const cmp = valA.localeCompare(valB);
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [filteredCustomers, sortField, sortOrder]);

  // Calculate pagination
  const totalCount = sortedCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Safe current page clamping
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedCustomers = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedCustomers.slice(start, start + pageSize);
  }, [sortedCustomers, safePage, pageSize]);

  // Sorting toggle handler
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortOrder('asc');
      }
      setCurrentPage(1);
    },
    [sortField]
  );

  // Safe page change handler
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((status: CustomerStatus | 'ALL') => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleDepartmentChange = useCallback((dept: CustomerDepartment | 'ALL') => {
    setDepartmentFilter(dept);
    setCurrentPage(1);
  }, []);

  return {
    searchQuery,
    statusFilter,
    departmentFilter,
    sortField,
    sortOrder,
    currentPage: safePage,
    pageSize,
    totalCount,
    totalPages,
    paginatedCustomers,
    allFilteredCount: filteredCustomers.length,
    isFiltered,
    setSearchQuery: handleSearchChange,
    setStatusFilter: handleStatusChange,
    setDepartmentFilter: handleDepartmentChange,
    handleSort,
    setCurrentPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    resetFilters,
  };
}
