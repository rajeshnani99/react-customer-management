import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCustomerFilterSort } from '../hooks/useCustomerFilterSort';
import { Customer } from '../types/customer';

const testCustomers: Customer[] = [
  {
    id: 'CUST-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1 555-111-2222',
    department: 'Engineering',
    status: 'Active',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'CUST-2',
    name: 'Bob Smith',
    email: 'bob@work.org',
    phone: '+1 555-333-4444',
    department: 'Sales',
    status: 'Pending',
    createdAt: '2026-01-05T10:00:00.000Z',
    updatedAt: '2026-01-05T10:00:00.000Z',
  },
  {
    id: 'CUST-3',
    name: 'Charlie Brown',
    email: 'charlie@salesforce.com',
    phone: '+1 555-555-6666',
    department: 'Sales',
    status: 'Active',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'CUST-4',
    name: 'Diana Prince',
    email: 'diana@themyscira.gov',
    phone: '+1 555-777-8888',
    department: 'Marketing',
    status: 'Inactive',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
  },
];

describe('useCustomerFilterSort hook', () => {
  it('filters customers by search query (name or email)', () => {
    const { result } = renderHook(() =>
      useCustomerFilterSort({ customers: testCustomers, initialPageSize: 10 })
    );

    act(() => {
      result.current.setSearchQuery('Alice');
    });

    expect(result.current.totalCount).toBe(1);
    expect(result.current.paginatedCustomers[0].name).toBe('Alice Johnson');

    act(() => {
      result.current.setSearchQuery('work.org');
    });

    expect(result.current.totalCount).toBe(1);
    expect(result.current.paginatedCustomers[0].name).toBe('Bob Smith');
  });

  it('filters customers by status', () => {
    const { result } = renderHook(() =>
      useCustomerFilterSort({ customers: testCustomers, initialPageSize: 10 })
    );

    act(() => {
      result.current.setStatusFilter('Active');
    });

    expect(result.current.totalCount).toBe(2);
    expect(result.current.paginatedCustomers.every((c) => c.status === 'Active')).toBe(true);
  });

  it('filters customers by department', () => {
    const { result } = renderHook(() =>
      useCustomerFilterSort({ customers: testCustomers, initialPageSize: 10 })
    );

    act(() => {
      result.current.setDepartmentFilter('Sales');
    });

    expect(result.current.totalCount).toBe(2);
    expect(result.current.paginatedCustomers.every((c) => c.department === 'Sales')).toBe(true);
  });

  it('sorts customers by name ascending and descending', () => {
    const { result } = renderHook(() =>
      useCustomerFilterSort({ customers: testCustomers, initialPageSize: 10 })
    );

    act(() => {
      result.current.handleSort('name'); // first click asc
    });

    expect(result.current.paginatedCustomers[0].name).toBe('Alice Johnson');
    expect(result.current.paginatedCustomers[3].name).toBe('Diana Prince');

    act(() => {
      result.current.handleSort('name'); // second click desc
    });

    expect(result.current.paginatedCustomers[0].name).toBe('Diana Prince');
    expect(result.current.paginatedCustomers[3].name).toBe('Alice Johnson');
  });

  it('handles pagination correctly', () => {
    const { result } = renderHook(() =>
      useCustomerFilterSort({ customers: testCustomers, initialPageSize: 2 })
    );

    expect(result.current.totalPages).toBe(2);
    expect(result.current.paginatedCustomers).toHaveLength(2);

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedCustomers).toHaveLength(2);
  });

  it('resets all filters when resetFilters is invoked', () => {
    const { result } = renderHook(() =>
      useCustomerFilterSort({ customers: testCustomers, initialPageSize: 10 })
    );

    act(() => {
      result.current.setSearchQuery('Diana');
      result.current.setStatusFilter('Inactive');
      result.current.setDepartmentFilter('Marketing');
    });

    expect(result.current.isFiltered).toBe(true);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.statusFilter).toBe('ALL');
    expect(result.current.departmentFilter).toBe('ALL');
    expect(result.current.isFiltered).toBe(false);
  });
});
