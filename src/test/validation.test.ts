import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  validateCustomerForm,
} from '../utils/validation';
import { Customer, CustomerFormData } from '../types/customer';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('accepts standard valid email addresses', () => {
      expect(isValidEmail('user@domain.com')).toBe(true);
      expect(isValidEmail('first.last@company.co.uk')).toBe(true);
      expect(isValidEmail('developer+test@startup.io')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('plainaddress')).toBe(false);
      expect(isValidEmail('@missingusername.com')).toBe(false);
      expect(isValidEmail('missingatsign.com')).toBe(false);
      expect(isValidEmail('user@nodomain')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('accepts standard phone numbers with 7 to 15 digits', () => {
      expect(isValidPhone('+1 (555) 234-5678')).toBe(true);
      expect(isValidPhone('+44 20 7946 0912')).toBe(true);
      expect(isValidPhone('555-1234')).toBe(true); // 7 digits
      expect(isValidPhone('+91 98200 12345')).toBe(true);
    });

    it('rejects phone numbers that are too short or invalid', () => {
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('12345')).toBe(false); // only 5 digits
      expect(isValidPhone('abc-def-ghij')).toBe(false);
    });
  });

  describe('validateCustomerForm', () => {
    const existingCustomers: Customer[] = [
      {
        id: 'CUST-1001',
        name: 'Sarah Connor',
        email: 'sarah.connor@cyberdyne.io',
        phone: '+1 (555) 234-5678',
        department: 'Engineering',
        status: 'Active',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ];

    const validData: CustomerFormData = {
      id: 'CUST-9999',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 000-1111',
      department: 'Engineering',
      status: 'Active',
      notes: 'Initial test notes',
    };

    it('passes for complete, valid customer data', () => {
      const result = validateCustomerForm(validData, existingCustomers);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('catches missing required fields', () => {
      const emptyData: CustomerFormData = {
        id: '',
        name: '',
        email: '',
        phone: '',
        department: '' as any,
        status: '' as any,
      };

      const result = validateCustomerForm(emptyData, existingCustomers);
      expect(result.isValid).toBe(false);
      expect(result.errors.id).toBeDefined();
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.phone).toBeDefined();
      expect(result.errors.department).toBeDefined();
      expect(result.errors.status).toBeDefined();
    });

    it('prevents duplicate customer IDs', () => {
      const duplicateData: CustomerFormData = {
        ...validData,
        id: 'CUST-1001', // Already exists in existingCustomers
      };

      const result = validateCustomerForm(duplicateData, existingCustomers);
      expect(result.isValid).toBe(false);
      expect(result.errors.id).toContain('already taken');
    });

    it('allows keeping the same ID when editing the existing customer', () => {
      const editData: CustomerFormData = {
        ...validData,
        id: 'CUST-1001',
      };

      // originalId matches CUST-1001
      const result = validateCustomerForm(editData, existingCustomers, 'CUST-1001');
      expect(result.isValid).toBe(true);
      expect(result.errors.id).toBeUndefined();
    });

    it('rejects invalid email and phone in form submission', () => {
      const invalidData: CustomerFormData = {
        ...validData,
        email: 'bad-email-format',
        phone: '123',
      };

      const result = validateCustomerForm(invalidData, existingCustomers);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
      expect(result.errors.phone).toBeDefined();
    });
  });
});
