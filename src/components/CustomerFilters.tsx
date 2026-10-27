import React from 'react';
import { CustomerDepartment, CustomerStatus } from '../types/customer';
import { VALID_DEPARTMENTS, VALID_STATUSES } from '../utils/validation';
import { Button } from './common/Button';

interface CustomerFiltersProps {
  searchQuery: string;
  statusFilter: CustomerStatus | 'ALL';
  departmentFilter: CustomerDepartment | 'ALL';
  isFiltered: boolean;
  totalFiltered: number;
  totalCustomers: number;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: CustomerStatus | 'ALL') => void;
  onDepartmentChange: (dept: CustomerDepartment | 'ALL') => void;
  onResetFilters: () => void;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  searchQuery,
  statusFilter,
  departmentFilter,
  isFiltered,
  totalFiltered,
  totalCustomers,
  onSearchChange,
  onStatusChange,
  onDepartmentChange,
  onResetFilters,
}) => {
  return (
    <div className="filter-bar" role="search" aria-label="Customer search and filters">
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          type="search"
          className="search-input"
          placeholder="Search by customer name, email, or ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search customers by name, email, or ID"
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search text"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-controls">
        <div className="filter-select-group">
          <label htmlFor="filter-status-select" className="filter-label">
            Status:
          </label>
          <select
            id="filter-status-select"
            className="filter-select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as CustomerStatus | 'ALL')}
            aria-label="Filter customers by status"
          >
            <option value="ALL">All Statuses</option>
            {VALID_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-select-group">
          <label htmlFor="filter-dept-select" className="filter-label">
            Department:
          </label>
          <select
            id="filter-dept-select"
            className="filter-select"
            value={departmentFilter}
            onChange={(e) =>
              onDepartmentChange(e.target.value as CustomerDepartment | 'ALL')
            }
            aria-label="Filter customers by department"
          >
            <option value="ALL">All Departments</option>
            {VALID_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="clear-filters-btn"
            leftIcon={<span>✕</span>}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="results-badge" aria-live="polite">
        Showing <strong>{totalFiltered}</strong> of <strong>{totalCustomers}</strong>
      </div>
    </div>
  );
};
