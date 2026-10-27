import React, { useEffect } from 'react';
import { Customer } from '../types/customer';
import { Badge } from './common/Badge';
import { Button } from './common/Button';

interface CustomerDetailsDrawerProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerDetailsDrawer: React.FC<CustomerDetailsDrawerProps> = ({
  customer,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !customer) return null;

  const formatFullDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoString;
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="drawer-overlay" role="presentation" onClick={onClose}>
      <aside
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-customer-name"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-title-group">
            <span className="drawer-eyebrow">Customer Profile</span>
            <h2 id="drawer-customer-name" className="drawer-title">
              {customer.name}
            </h2>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close customer details"
          >
            ✕
          </button>
        </div>

        <div className="drawer-content">
          <div className="drawer-hero-card">
            <div className="drawer-avatar" aria-hidden="true">
              {getInitials(customer.name)}
            </div>
            <div className="drawer-hero-meta">
              <span className="drawer-id-badge">{customer.id}</span>
              <div className="drawer-tags-row">
                <Badge variant="status" status={customer.status}>
                  {customer.status}
                </Badge>
                <Badge variant="department" department={customer.department}>
                  {customer.department}
                </Badge>
              </div>
            </div>
          </div>

          <div className="drawer-section">
            <h3 className="drawer-section-heading">Contact Information</h3>
            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <a href={`mailto:${customer.email}`} className="detail-link">
                ✉ {customer.email}
              </a>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone Number</span>
              <a href={`tel:${customer.phone}`} className="detail-link">
                📞 {customer.phone}
              </a>
            </div>
          </div>

          <div className="drawer-section">
            <h3 className="drawer-section-heading">Account Timeline</h3>
            <div className="detail-item">
              <span className="detail-label">Created At</span>
              <span className="detail-value">{formatFullDate(customer.createdAt)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Updated</span>
              <span className="detail-value">{formatFullDate(customer.updatedAt)}</span>
            </div>
          </div>

          <div className="drawer-section">
            <h3 className="drawer-section-heading">Strategic Context & Notes</h3>
            <div className="detail-notes-box">
              {customer.notes ? (
                <p className="detail-notes-text">{customer.notes}</p>
              ) : (
                <p className="detail-notes-empty">No additional notes recorded for this customer.</p>
              )}
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onClose();
              onDelete(customer);
            }}
          >
            Delete
          </Button>
          <div className="drawer-footer-right">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(customer);
              }}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
};
