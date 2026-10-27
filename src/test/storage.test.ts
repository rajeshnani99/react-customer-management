import { describe, it, expect, beforeEach } from 'vitest';
import {
  STORAGE_KEY,
  INITIAL_CUSTOMERS,
  loadCustomers,
  saveCustomers,
  resetCustomers,
  generateNextCustomerId,
} from '../services/storage';
import { Customer } from '../types/customer';

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads default seed customers when localStorage is empty', () => {
    const customers = loadCustomers();
    expect(customers.length).toBe(INITIAL_CUSTOMERS.length);
    expect(customers[0].id).toBe('CUST-1001');
  });

  it('handles malformed JSON in localStorage gracefully without throwing', () => {
    localStorage.setItem(STORAGE_KEY, '{{bad-json:broken');
    const customers = loadCustomers();
    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBe(INITIAL_CUSTOMERS.length);
  });

  it('handles non-array stored data by restoring initial seed data', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ someKey: 'not-an-array' }));
    const customers = loadCustomers();
    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBe(INITIAL_CUSTOMERS.length);
  });

  it('persists and retrieves valid customer updates', () => {
    const customList: Customer[] = [
      {
        id: 'CUST-2001',
        name: 'Custom User',
        email: 'custom@user.com',
        phone: '+1 555-999-0000',
        department: 'Product',
        status: 'Active',
        createdAt: '2026-03-01T00:00:00.000Z',
        updatedAt: '2026-03-01T00:00:00.000Z',
      },
    ];

    saveCustomers(customList);
    const loaded = loadCustomers();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].name).toBe('Custom User');
  });

  it('resets customers back to initial defaults when requested', () => {
    saveCustomers([]);
    expect(loadCustomers()).toEqual([]);

    resetCustomers();
    expect(loadCustomers().length).toBe(INITIAL_CUSTOMERS.length);
  });

  it('generates the next sequential ID accurately', () => {
    const sample: Customer[] = [
      { ...INITIAL_CUSTOMERS[0], id: 'CUST-1001' },
      { ...INITIAL_CUSTOMERS[1], id: 'CUST-1005' },
    ];

    const nextId = generateNextCustomerId(sample);
    expect(nextId).toBe('CUST-1006');
  });
});
