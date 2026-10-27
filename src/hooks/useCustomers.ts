import { useState, useEffect, useCallback } from 'react';
import { Customer, CustomerFormData, CustomerFormErrors } from '../types/customer';
import {
  loadCustomers,
  saveCustomers,
  resetCustomers as resetStorageCustomers,
  generateNextCustomerId,
} from '../services/storage';
import { validateCustomerForm } from '../utils/validation';

export function useCustomers(
  onNotification?: (type: 'success' | 'error' | 'info', message: string, title?: string) => void
) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load customers on initial mount safely
  useEffect(() => {
    const loaded = loadCustomers();
    setCustomers(loaded);
    setIsInitialized(true);
  }, []);

  // Sync to localStorage whenever customers state changes (after initial load)
  useEffect(() => {
    if (isInitialized) {
      saveCustomers(customers);
    }
  }, [customers, isInitialized]);

  /**
   * Helper to fetch next recommended unique ID
   */
  const getNextId = useCallback(() => {
    return generateNextCustomerId(customers);
  }, [customers]);

  /**
   * Create a new customer
   */
  const addCustomer = useCallback(
    (formData: CustomerFormData): { success: boolean; errors?: CustomerFormErrors } => {
      const validation = validateCustomerForm(formData, customers);
      if (!validation.isValid) {
        onNotification?.('error', 'Please resolve the highlighted validation errors before saving.');
        return { success: false, errors: validation.errors };
      }

      const now = new Date().toISOString();
      const newCustomer: Customer = {
        id: formData.id.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department,
        status: formData.status,
        notes: formData.notes?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };

      setCustomers((prev) => [newCustomer, ...prev]);
      onNotification?.('success', `Customer "${newCustomer.name}" (${newCustomer.id}) created successfully.`);
      return { success: true };
    },
    [customers, onNotification]
  );

  /**
   * Update an existing customer
   */
  const updateCustomer = useCallback(
    (
      originalId: string,
      formData: CustomerFormData
    ): { success: boolean; errors?: CustomerFormErrors } => {
      const existing = customers.find((c) => c.id === originalId);
      if (!existing) {
        onNotification?.('error', `Customer with ID "${originalId}" was not found.`);
        return { success: false };
      }

      const validation = validateCustomerForm(formData, customers, originalId);
      if (!validation.isValid) {
        onNotification?.('error', 'Please resolve the highlighted validation errors before saving.');
        return { success: false, errors: validation.errors };
      }

      const updatedCustomer: Customer = {
        ...existing,
        id: formData.id.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department,
        status: formData.status,
        notes: formData.notes?.trim() || undefined,
        updatedAt: new Date().toISOString(),
      };

      setCustomers((prev) =>
        prev.map((c) => (c.id === originalId ? updatedCustomer : c))
      );
      onNotification?.('success', `Customer "${updatedCustomer.name}" updated successfully.`);
      return { success: true };
    },
    [customers, onNotification]
  );

  /**
   * Delete an existing customer by ID
   */
  const deleteCustomer = useCallback(
    (id: string): { success: boolean } => {
      const target = customers.find((c) => c.id === id);
      if (!target) {
        onNotification?.('error', `Cannot delete: Customer with ID "${id}" does not exist.`);
        return { success: false };
      }

      setCustomers((prev) => prev.filter((c) => c.id !== id));
      onNotification?.('success', `Customer "${target.name}" (${target.id}) was permanently deleted.`);
      return { success: true };
    },
    [customers, onNotification]
  );

  /**
   * Reset customers back to default seed dataset
   */
  const resetToSeedData = useCallback(() => {
    const defaultData = resetStorageCustomers();
    setCustomers(defaultData);
    onNotification?.('info', 'Customer database has been reset to default mock records.');
  }, [onNotification]);

  /**
   * Get single customer by ID
   */
  const getCustomerById = useCallback(
    (id: string): Customer | undefined => {
      return customers.find((c) => c.id === id);
    },
    [customers]
  );

  return {
    customers,
    isInitialized,
    getNextId,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    resetToSeedData,
    getCustomerById,
  };
}
