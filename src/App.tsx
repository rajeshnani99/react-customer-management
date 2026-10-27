import React, { useState, useCallback } from 'react';
import './App.css';
import { Customer, CustomerFormData } from './types/customer';
import { useToast } from './hooks/useToast';
import { useCustomers } from './hooks/useCustomers';
import { useCustomerFilterSort } from './hooks/useCustomerFilterSort';

import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { CustomerFilters } from './components/CustomerFilters';
import { CustomerTable } from './components/CustomerTable';
import { Pagination } from './components/Pagination';
import { CustomerFormModal } from './components/CustomerFormModal';
import { CustomerDetailsDrawer } from './components/CustomerDetailsDrawer';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { ToastContainer } from './components/common/Toast';

export const App: React.FC = () => {
  const { toasts, removeToast, addToast } = useToast();

  const handleNotification = useCallback(
    (type: 'success' | 'error' | 'info', message: string, title?: string) => {
      addToast(type, message, title);
    },
    [addToast]
  );

  const {
    customers,
    isInitialized,
    getNextId,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    resetToSeedData,
  } = useCustomers(handleNotification);

  const {
    searchQuery,
    statusFilter,
    departmentFilter,
    sortField,
    sortOrder,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    paginatedCustomers,
    isFiltered,
    setSearchQuery,
    setStatusFilter,
    setDepartmentFilter,
    handleSort,
    setCurrentPage,
    setPageSize,
    resetFilters,
  } = useCustomerFilterSort({ customers, initialPageSize: 5 });

  // Modal & Drawer UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

  const [drawerCustomer, setDrawerCustomer] = useState<Customer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Form Handlers
  const handleOpenCreate = () => {
    setCustomerToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCustomerToEdit(null);
  };

  const handleFormSubmit = (formData: CustomerFormData) => {
    if (customerToEdit) {
      const result = updateCustomer(customerToEdit.id, formData);
      if (result.success && drawerCustomer?.id === customerToEdit.id) {
        // If drawer is currently showing this customer, update drawer customer state too
        setDrawerCustomer((prev) =>
          prev ? { ...prev, ...formData, updatedAt: new Date().toISOString() } : null
        );
      }
      return result;
    } else {
      return addCustomer(formData);
    }
  };

  // Details Drawer Handlers
  const handleViewCustomer = (customer: Customer) => {
    setDrawerCustomer(customer);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerCustomer(null);
  };

  // Delete Handlers
  const handlePromptDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!customerToDelete) return;
    deleteCustomer(customerToDelete.id);
    if (drawerCustomer?.id === customerToDelete.id) {
      handleCloseDrawer();
    }
    setIsConfirmDeleteOpen(false);
    setCustomerToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmDeleteOpen(false);
    setCustomerToDelete(null);
  };

  if (!isInitialized) {
    return (
      <div className="app-layout">
        <div className="app-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <p>Loading Customer Directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <main className="app-container">
        {/* Top Header */}
        <Header
          totalCount={customers.length}
          onAddClick={handleOpenCreate}
          onResetClick={resetToSeedData}
        />

        {/* Real-time KPI Stats Cards */}
        <StatsOverview customers={customers} />

        {/* Search & Filters */}
        <CustomerFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          departmentFilter={departmentFilter}
          isFiltered={isFiltered}
          totalFiltered={totalCount}
          totalCustomers={customers.length}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          onDepartmentChange={setDepartmentFilter}
          onResetFilters={resetFilters}
        />

        {/* Customer Data Table */}
        <CustomerTable
          customers={paginatedCustomers}
          sortField={sortField}
          sortOrder={sortOrder}
          isFiltered={isFiltered}
          onSort={handleSort}
          onView={handleViewCustomer}
          onEdit={handleOpenEdit}
          onDelete={handlePromptDelete}
          onResetFilters={resetFilters}
          onAddClick={handleOpenCreate}
        />

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </main>

      {/* Create / Edit Customer Modal */}
      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        customerToEdit={customerToEdit}
        nextGeneratedId={getNextId()}
      />

      {/* Customer Details Drawer */}
      <CustomerDetailsDrawer
        customer={drawerCustomer}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onEdit={handleOpenEdit}
        onDelete={handlePromptDelete}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        title="Confirm Customer Deletion"
        message={`Are you sure you want to permanently delete customer "${customerToDelete?.name}" (${customerToDelete?.id})? This action cannot be reversed.`}
        confirmLabel="Delete Customer"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default App;
