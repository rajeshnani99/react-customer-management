import React, { useState, useEffect, useRef } from 'react';
import {
  Customer,
  CustomerDepartment,
  CustomerFormData,
  CustomerFormErrors,
  CustomerStatus,
} from '../types/customer';
import { VALID_DEPARTMENTS, VALID_STATUSES } from '../utils/validation';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { Button } from './common/Button';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => { success: boolean; errors?: CustomerFormErrors };
  customerToEdit?: Customer | null;
  nextGeneratedId: string;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customerToEdit,
  nextGeneratedId,
}) => {
  const isEditMode = Boolean(customerToEdit);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CustomerFormData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    status: 'Active',
    notes: '',
  });

  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or reset form state whenever modal opens or customerToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (customerToEdit) {
        setFormData({
          id: customerToEdit.id,
          name: customerToEdit.name,
          email: customerToEdit.email,
          phone: customerToEdit.phone,
          department: customerToEdit.department,
          status: customerToEdit.status,
          notes: customerToEdit.notes || '',
        });
      } else {
        setFormData({
          id: nextGeneratedId,
          name: '',
          email: '',
          phone: '',
          department: 'Engineering',
          status: 'Active',
          notes: '',
        });
      }
      setErrors({});
      setIsSubmitting(false);

      // Focus first actionable field
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, customerToEdit, nextGeneratedId]);

  const handleChange = (
    field: keyof CustomerFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for field once user types
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = onSubmit(formData);
    if (result.success) {
      onClose();
    } else if (result.errors) {
      setErrors(result.errors);
      setIsSubmitting(false);
    }
  };

  const departmentOptions = VALID_DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
  }));

  const statusOptions = VALID_STATUSES.map((st) => ({
    value: st,
    label: st,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? `Edit Customer (${customerToEdit?.id})` : 'Create New Customer'}
      description={
        isEditMode
          ? 'Update the customer profile details and contact information below.'
          : 'Complete the form to register a new customer in the directory.'
      }
      maxWidth="lg"
      footer={
        <div className="form-modal-actions">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {isEditMode ? 'Save Changes' : 'Create Customer'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="customer-form" noValidate>
        <div className="form-grid-2">
          <Input
            label="Customer ID"
            id="customer-id"
            value={formData.id}
            onChange={(e) => handleChange('id', e.target.value)}
            error={errors.id}
            isRequired
            placeholder="e.g. CUST-1015"
            helperText={
              isEditMode
                ? 'Unique account identifier'
                : 'Auto-suggested identifier, unique across all clients'
            }
          />

          <Input
            ref={nameInputRef}
            label="Full Name"
            id="customer-name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            isRequired
            placeholder="e.g. Jonathan Vance"
          />
        </div>

        <div className="form-grid-2">
          <Input
            label="Email Address"
            id="customer-email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            isRequired
            placeholder="e.g. jonathan@company.com"
          />

          <Input
            label="Phone Number"
            id="customer-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            isRequired
            placeholder="e.g. +1 (555) 234-5678"
            helperText="Include country or area code (7-15 digits)"
          />
        </div>

        <div className="form-grid-2">
          <Select
            label="Department"
            id="customer-dept"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value as CustomerDepartment)}
            options={departmentOptions}
            error={errors.department}
            isRequired
          />

          <Select
            label="Customer Status"
            id="customer-status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as CustomerStatus)}
            options={statusOptions}
            error={errors.status}
            isRequired
          />
        </div>

        <div className="form-field">
          <div className="form-label-with-counter">
            <label htmlFor="customer-notes" className="form-label">
              Notes & Strategic Context
            </label>
            <span className="char-counter">
              {(formData.notes || '').length} / 500
            </span>
          </div>
          <textarea
            id="customer-notes"
            className="form-textarea"
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Key account details, contract terms, or special handling notes..."
            maxLength={500}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={errors.notes ? 'customer-notes-error' : undefined}
          />
          {errors.notes && (
            <p id="customer-notes-error" className="form-error-message" role="alert">
              {errors.notes}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
};
