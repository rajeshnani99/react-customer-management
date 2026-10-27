import React from 'react';
import { Customer, SortField, SortOrder } from '../types/customer';
import { Badge } from './common/Badge';
import { Button } from './common/Button';

interface CustomerTableProps {
  customers: Customer[];
  sortField: SortField;
  sortOrder: SortOrder;
  isFiltered: boolean;
  onSort: (field: SortField) => void;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onResetFilters: () => void;
  onAddClick: () => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  sortField,
  sortOrder,
  isFiltered,
  onSort,
  onView,
  onEdit,
  onDelete,
  onResetFilters,
  onAddClick,
}) => {
  // Deterministic avatar color generation
  const getAvatarColor = (name: string) => {
    const colors = [
      '#4f46e5',
      '#059669',
      '#d97706',
      '#7c3aed',
      '#db2777',
      '#0284c7',
      '#e11d48',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <span className="sort-arrow inactive" aria-hidden="true">↕</span>;
    }
    return (
      <span className="sort-arrow active" aria-hidden="true">
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  const getAriaSort = (field: SortField) => {
    if (sortField !== field) return 'none';
    return sortOrder === 'asc' ? 'ascending' : 'descending';
  };

  // Empty states
  if (customers.length === 0) {
    if (isFiltered) {
      return (
        <div className="empty-state-card" role="status">
          <div className="empty-state-icon" aria-hidden="true">
            🔎
          </div>
          <h3 className="empty-state-title">No matching customers</h3>
          <p className="empty-state-description">
            We couldn't find any customers matching your current search or filter criteria.
          </p>
          <Button variant="outline" size="md" onClick={onResetFilters}>
            Clear All Filters
          </Button>
        </div>
      );
    }

    return (
      <div className="empty-state-card" role="status">
        <div className="empty-state-icon" aria-hidden="true">
          👥
        </div>
        <h3 className="empty-state-title">No customers in database</h3>
        <p className="empty-state-description">
          Get started by adding your first client record or resetting to mock data.
        </p>
        <div className="empty-state-actions">
          <Button variant="primary" size="md" onClick={onAddClick}>
            + Add First Customer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="table-responsive-container">
      <table className="customer-table" aria-label="Customer Accounts Table">
        <thead>
          <tr>
            <th scope="col" aria-sort={getAriaSort('id')}>
              <button
                type="button"
                className="sortable-header-btn"
                onClick={() => onSort('id')}
              >
                <span>ID</span>
                {renderSortIndicator('id')}
              </button>
            </th>
            <th scope="col" aria-sort={getAriaSort('name')}>
              <button
                type="button"
                className="sortable-header-btn"
                onClick={() => onSort('name')}
              >
                <span>Customer</span>
                {renderSortIndicator('name')}
              </button>
            </th>
            <th scope="col">Phone</th>
            <th scope="col" aria-sort={getAriaSort('department')}>
              <button
                type="button"
                className="sortable-header-btn"
                onClick={() => onSort('department')}
              >
                <span>Department</span>
                {renderSortIndicator('department')}
              </button>
            </th>
            <th scope="col" aria-sort={getAriaSort('status')}>
              <button
                type="button"
                className="sortable-header-btn"
                onClick={() => onSort('status')}
              >
                <span>Status</span>
                {renderSortIndicator('status')}
              </button>
            </th>
            <th scope="col" aria-sort={getAriaSort('createdAt')}>
              <button
                type="button"
                className="sortable-header-btn"
                onClick={() => onSort('createdAt')}
              >
                <span>Created</span>
                {renderSortIndicator('createdAt')}
              </button>
            </th>
            <th scope="col" className="text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="customer-row"
              onClick={() => onView(customer)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onView(customer);
                }
              }}
            >
              <td className="cell-id">
                <span className="id-tag">{customer.id}</span>
              </td>
              <td className="cell-customer">
                <div className="customer-avatar-group">
                  <div
                    className="customer-avatar"
                    style={{ backgroundColor: getAvatarColor(customer.name) }}
                    aria-hidden="true"
                  >
                    {getInitials(customer.name)}
                  </div>
                  <div className="customer-name-group">
                    <span className="customer-name">{customer.name}</span>
                    <span className="customer-email">{customer.email}</span>
                  </div>
                </div>
              </td>
              <td className="cell-phone">
                <span className="phone-text">{customer.phone}</span>
              </td>
              <td className="cell-department">
                <Badge variant="department" department={customer.department}>
                  {customer.department}
                </Badge>
              </td>
              <td className="cell-status">
                <Badge variant="status" status={customer.status}>
                  {customer.status}
                </Badge>
              </td>
              <td className="cell-date">
                <span className="date-text">{formatDate(customer.createdAt)}</span>
              </td>
              <td className="cell-actions text-right" onClick={(e) => e.stopPropagation()}>
                <div className="action-buttons-group">
                  <button
                    type="button"
                    className="action-icon-btn view-btn"
                    onClick={() => onView(customer)}
                    title={`View details for ${customer.name}`}
                    aria-label={`View details for ${customer.name}`}
                  >
                    👁
                  </button>
                  <button
                    type="button"
                    className="action-icon-btn edit-btn"
                    onClick={() => onEdit(customer)}
                    title={`Edit ${customer.name}`}
                    aria-label={`Edit ${customer.name}`}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="action-icon-btn delete-btn"
                    onClick={() => onDelete(customer)}
                    title={`Delete ${customer.name}`}
                    aria-label={`Delete ${customer.name}`}
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
