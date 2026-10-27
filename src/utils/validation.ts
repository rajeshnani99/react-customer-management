import { Customer, CustomerDepartment, CustomerFormData, CustomerFormErrors, CustomerStatus } from '../types/customer';

export const VALID_DEPARTMENTS: CustomerDepartment[] = [
  'Engineering',
  'Sales',
  'Marketing',
  'Support',
  'Finance',
  'Operations',
  'Product',
];

export const VALID_STATUSES: CustomerStatus[] = ['Active', 'Inactive', 'Pending', 'Lead'];

// Standard RFC 5322 compliant simplified email regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone regex allowing optional international prefix, digits, spaces, hyphens, and parentheses
export const PHONE_FORMAT_REGEX = /^[+]?[\d\s().-]+$/;

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validates phone format reasonably:
 * - Must contain only valid phone characters (digits, +, spaces, hyphens, parentheses, dots)
 * - Must contain between 7 and 15 digits (ITU-T E.164 recommendation)
 */
export function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return false;
  if (!PHONE_FORMAT_REGEX.test(trimmed)) return false;
  const digitsOnly = trimmed.replace(/\D/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

/**
 * Validates the full customer form data.
 * @param formData - The data submitted by the user
 * @param existingCustomers - All existing customers to check for unique ID conflicts
 * @param originalId - If editing, the original customer ID (so it's not considered a duplicate of itself)
 */
export function validateCustomerForm(
  formData: CustomerFormData,
  existingCustomers: Customer[],
  originalId?: string
): { isValid: boolean; errors: CustomerFormErrors } {
  const errors: CustomerFormErrors = {};

  // 1. Customer ID validation
  const trimmedId = formData.id?.trim();
  if (!trimmedId) {
    errors.id = 'Customer ID is required.';
  } else if (!/^[A-Za-z0-9-_]+$/.test(trimmedId)) {
    errors.id = 'Customer ID may only contain letters, numbers, hyphens, and underscores.';
  } else if (trimmedId.length < 3 || trimmedId.length > 20) {
    errors.id = 'Customer ID must be between 3 and 20 characters.';
  } else {
    // Check uniqueness
    const isDuplicate = existingCustomers.some(
      (c) => c.id.toLowerCase() === trimmedId.toLowerCase() && c.id !== originalId
    );
    if (isDuplicate) {
      errors.id = `Customer ID "${trimmedId}" is already taken. Please use a unique ID.`;
    }
  }

  // 2. Full Name validation
  const trimmedName = formData.name?.trim();
  if (!trimmedName) {
    errors.name = 'Full name is required.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  } else if (trimmedName.length > 60) {
    errors.name = 'Full name cannot exceed 60 characters.';
  } else if (/^\d+$/.test(trimmedName)) {
    errors.name = 'Full name cannot be purely numeric.';
  }

  // 3. Email validation
  const trimmedEmail = formData.email?.trim();
  if (!trimmedEmail) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = 'Please enter a valid email address (e.g. name@company.com).';
  } else if (trimmedEmail.length > 100) {
    errors.email = 'Email address cannot exceed 100 characters.';
  }

  // 4. Phone validation
  const trimmedPhone = formData.phone?.trim();
  if (!trimmedPhone) {
    errors.phone = 'Phone number is required.';
  } else if (!isValidPhone(trimmedPhone)) {
    errors.phone = 'Please enter a valid phone number with 7 to 15 digits (e.g. +1 (555) 012-3456).';
  }

  // 5. Department validation
  if (!formData.department) {
    errors.department = 'Department is required.';
  } else if (!VALID_DEPARTMENTS.includes(formData.department)) {
    errors.department = 'Please select a valid department.';
  }

  // 6. Status validation
  if (!formData.status) {
    errors.status = 'Status is required.';
  } else if (!VALID_STATUSES.includes(formData.status)) {
    errors.status = 'Please select a valid status.';
  }

  // 7. Optional Notes validation
  if (formData.notes && formData.notes.length > 500) {
    errors.notes = 'Notes cannot exceed 500 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
