import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { INITIAL_CUSTOMERS } from '../services/storage';

describe('Customer Management CRUD Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initial dashboard with seed customers and statistics', async () => {
    render(<App />);

    // Brand title
    expect(screen.getByText('CustomerHub')).toBeInTheDocument();

    // Table header
    expect(screen.getByRole('table', { name: /customer accounts table/i })).toBeInTheDocument();

    // Initial first seed customer
    expect(await screen.findByText(INITIAL_CUSTOMERS[0].name)).toBeInTheDocument();
    expect(screen.getByText(INITIAL_CUSTOMERS[0].email)).toBeInTheDocument();
  });

  it('validates required fields when creating a customer', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click "Add Customer" button
    const addBtn = screen.getByRole('button', { name: /add customer/i });
    await user.click(addBtn);

    // Verify modal is open
    expect(screen.getByRole('dialog', { name: /create new customer/i })).toBeInTheDocument();

    // The name input is initially empty; click Create Customer
    const submitBtn = screen.getByRole('button', { name: /create customer/i });
    await user.click(submitBtn);

    // Validation errors should appear
    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
  });

  it('validates email and phone formats during creation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /add customer/i }));

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const phoneInput = screen.getByLabelText(/phone number/i);

    await user.type(nameInput, 'Bruce Wayne');
    await user.type(emailInput, 'invalid-email');
    await user.type(phoneInput, '123'); // too short

    const submitBtn = screen.getByRole('button', { name: /create customer/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
  });

  it('successfully creates a new customer and displays in table', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /add customer/i }));

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const phoneInput = screen.getByLabelText(/phone number/i);

    await user.type(nameInput, 'Diana Prince');
    await user.type(emailInput, 'diana@amazon.org');
    await user.type(phoneInput, '+1 (555) 789-1234');

    const submitBtn = screen.getByRole('button', { name: /create customer/i });
    await user.click(submitBtn);

    // Confirm success toast appears
    expect(await screen.findByText(/created successfully/i)).toBeInTheDocument();

    // Search for newly created customer to view in paginated table
    const searchInput = screen.getByPlaceholderText(/search by customer name/i);
    await user.type(searchInput, 'Diana Prince');

    expect(await screen.findByText('Diana Prince')).toBeInTheDocument();
    expect(screen.getByText('diana@amazon.org')).toBeInTheDocument();
  });

  it('edits an existing customer successfully', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Sarah Connor is the first customer
    const firstCustomer = INITIAL_CUSTOMERS[0];
    expect(await screen.findByText(firstCustomer.name)).toBeInTheDocument();

    const editBtn = screen.getByRole('button', { name: new RegExp(`edit ${firstCustomer.name}`, 'i') });
    await user.click(editBtn);

    expect(screen.getByRole('dialog', { name: new RegExp(`edit customer \\(${firstCustomer.id}\\)`, 'i') })).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Sarah Connor-Reese');

    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(await screen.findByText('Sarah Connor-Reese')).toBeInTheDocument();
    expect(screen.getByText(/updated successfully/i)).toBeInTheDocument();
  });

  it('requires confirmation before deleting a customer', async () => {
    const user = userEvent.setup();
    render(<App />);

    const firstCustomer = INITIAL_CUSTOMERS[0];
    expect(await screen.findByText(firstCustomer.name)).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', { name: new RegExp(`delete ${firstCustomer.name}`, 'i') });
    await user.click(deleteBtn);

    // Confirmation dialog should appear
    expect(screen.getByRole('dialog', { name: /confirm customer deletion/i })).toBeInTheDocument();

    // Cancel deletion
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);

    // Customer still present
    expect(screen.queryByRole('dialog', { name: /confirm customer deletion/i })).not.toBeInTheDocument();
    expect(screen.getByText(firstCustomer.name)).toBeInTheDocument();

    // Open delete confirmation again and confirm
    await user.click(screen.getByRole('button', { name: new RegExp(`delete ${firstCustomer.name}`, 'i') }));
    const confirmDeleteBtn = screen.getByRole('button', { name: /delete customer/i });
    await user.click(confirmDeleteBtn);

    // Customer deleted and notification displayed
    await waitFor(() => {
      expect(screen.queryByText(firstCustomer.name)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/was permanently deleted/i)).toBeInTheDocument();
  });

  it('opens and closes the customer details drawer', async () => {
    const user = userEvent.setup();
    render(<App />);

    const firstCustomer = INITIAL_CUSTOMERS[0];
    expect(await screen.findByText(firstCustomer.name)).toBeInTheDocument();

    const viewBtn = screen.getByRole('button', { name: new RegExp(`view details for ${firstCustomer.name}`, 'i') });
    await user.click(viewBtn);

    // Drawer should open with customer details
    expect(screen.getByRole('dialog', { name: new RegExp(firstCustomer.name, 'i') })).toBeInTheDocument();
    expect(screen.getByText(/contact information/i)).toBeInTheDocument();
    expect(screen.getByText(`✉ ${firstCustomer.email}`)).toBeInTheDocument();

    // Close drawer
    const closeBtn = screen.getByRole('button', { name: /close customer details/i });
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText(/contact information/i)).not.toBeInTheDocument();
    });
  });

  it('supports empty state when searching for nonexistent query', async () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText(/search by customer name/i);
    fireEvent.change(searchInput, { target: { value: 'XYZ987NonExistent' } });

    expect(await screen.findByText(/no matching customers/i)).toBeInTheDocument();

    // Clicking Clear All Filters restores table
    const clearBtn = screen.getByRole('button', { name: /clear all filters/i });
    fireEvent.click(clearBtn);

    expect(await screen.findByText(INITIAL_CUSTOMERS[0].name)).toBeInTheDocument();
  });
});
