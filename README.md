# CustomerHub — React Customer Management Application

A high-performance, enterprise-grade Customer Management application built with **React 18**, **TypeScript**, and **Vite**. Designed specifically for frontend technical interviews and timed hackathons, emphasizing clean component boundaries, unidirectional data flow, keyboard accessibility, safe local persistence, and comprehensive test coverage.

---

## 🚀 Key Highlights & Architecture Decisions

- **Zero Heavy External UI Dependencies**: Built with Vanilla CSS design tokens (CSS variables) to ensure blazing fast compilation, zero bundle bloat, and total styling freedom.
- **Strict Separation of Concerns**:
  - `src/types/customer.ts`: Strongly typed domain model and UI contracts.
  - `src/services/storage.ts`: Resilient persistence layer with automatic schema validation, safe error recovery, and seed generation.
  - `src/utils/validation.ts`: Pure, testable validation functions for email, international phone numbers, and duplicate ID prevention.
  - `src/hooks/useCustomers.ts`: Centralized CRUD state machine, immutable updates, and notification triggers.
  - `src/hooks/useCustomerFilterSort.ts`: High-performance memoized filtering (search, status, department), multi-column sorting, and pagination logic.
  - `src/components/common/`: Accessible primitives (`Button`, `Input`, `Select`, `Modal`, `ConfirmDialog`, `Badge`, `Toast`).
  - `src/components/`: Composed domain views (`Header`, `StatsOverview`, `CustomerFilters`, `CustomerTable`, `Pagination`, `CustomerFormModal`, `CustomerDetailsDrawer`).
- **Resilient Offline Persistence**: Stores customer data in `localStorage` (`rcm_customers_v1`). Recovers gracefully from empty, invalid, or corrupted JSON payloads by seeding pre-populated mock data.
- **Robust Field-Level Validation**:
  - Real-time inline field errors with `aria-invalid` and `aria-describedby` attributes.
  - RFC 5322-compliant email validation.
  - ITU-T E.164-compliant phone validation (7 to 15 digits supporting country codes and standard formatting).
  - Case-insensitive duplicate customer ID detection.
- **Accessible & Interactive**:
  - Modal focus trapping, backdrop dismiss, and `Escape` key listeners.
  - Two-step destructive confirmation dialog before deleting records.
  - Floating toast notifications with auto-dismiss timers.
  - Dedicated side-drawer profile panel for customer details, notes, and quick actions.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18.3** | Component rendering, hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useId`, `useRef`) |
| **TypeScript 5.6** | Static typing, interface contracts, compile-time safety |
| **Vite 5.4** | Ultra-fast HMR and production bundling |
| **Vitest 1.6** | Lightning-fast test runner compatible with Vite |
| **React Testing Library** | User-centric DOM testing and accessible querying |
| **Plain CSS** | Modern CSS custom properties, responsive grid/flexbox, animations |

---

## 📋 Functional Requirements Matrix

| Requirement | Implementation |
| :--- | :--- |
| **1. Customer Directory Table** | Responsive, mobile-scrollable table with avatar initials, status badges, and action toolbars. |
| **2. Customer Record Fields** | Unique ID (`id`), Full Name (`name`), Email (`email`), Phone (`phone`), Department (`department`), Status (`status`), Created/Updated timestamps, and Strategic Notes. |
| **3. Full CRUD Operations** | Create new records, Read in table & details drawer, Update via pre-filled modal, Delete with confirmation. |
| **4. Create & Edit Form** | Accessible modal dialog with automatic ID suggestion and autofocus on actionable fields. |
| **5. Required Field Validation** | Inline alerts for missing ID, Name, Email, Phone, Department, or Status. |
| **6. Email Validation** | Strict regex checking structure `username@domain.tld`. |
| **7. Phone Validation** | Regex allowing `+`, `()`, `-`, spaces with 7–15 digits enforcement. |
| **8. Field-Specific Feedback** | Direct error messages below inputs linked via `aria-describedby`. |
| **9. Name, Email & ID Search** | Live case-insensitive search across name, email, and customer ID with clear (✕) button. |
| **10. Status & Dept Filtering** | Dropdown filters for Status (`Active`, `Inactive`, `Pending`, `Lead`) and Department (`Engineering`, `Sales`, `Support`, `Marketing`, `Finance`, `Operations`, `Product`). |
| **11. Sorting & Pagination** | Column header sorting (Asc/Desc with ▲/▼ indicators), page size selector (5, 10, 20), page jumps, and record ranges. |
| **12. Deletion Confirmation** | Accessible destructive confirmation modal preventing accidental data loss. |
| **13. Success & Error Feedback** | Floating toast notification stack with auto-dismiss and color-coded status badges. |
| **14. Empty States** | Contextual zero-result cards with "Clear All Filters" and "Add First Customer" CTAs. |
| **15. LocalStorage Persistence** | Automatic serialization to `rcm_customers_v1` with reset capability. |
| **16. Customer Details Panel** | Slide-over drawer with direct `mailto:` and `tel:` links, audit timestamps, and notes. |

---

## 🔄 State Management & Unidirectional Data Flow

```
                  ┌──────────────────────────────────────────────┐
                  │                 localStorage                 │
                  └──────────────────────┬───────────────────────┘
                                         │ (safe parse / seed)
                                         ▼
                             ┌───────────────────────┐
                             │    useCustomers()     │ ◄─── (add, update, delete, reset)
                             └───────────┬───────────┘
                                         │ customers[]
                                         ▼
                          ┌─────────────────────────────┐
                          │  useCustomerFilterSort()    │ ◄─── (search, filter, sort, page)
                          └──────────────┬──────────────┘
                                         │ paginatedCustomers[], totalCount, totalPages
                                         ▼
                     ┌───────────────────┴───────────────────┐
                     │                                       │
                     ▼                                       ▼
           ┌───────────────────┐                   ┌───────────────────┐
           │   CustomerTable   │                   │    Pagination     │
           └─────────┬─────────┘                   └───────────────────┘
                     │ (onView, onEdit, onDelete)
                     ▼
       ┌───────────────────────────────┐
       │ App Modal / Drawer Orchestrator│ ───► useToast() (Feedback toasts)
       └───────────────────────────────┘
```

1. **Storage Layer (`storage.ts`)**: Loads from `localStorage`. If empty or malformed, seeds `INITIAL_CUSTOMERS` (12 realistic accounts).
2. **Entity Hook (`useCustomers.ts`)**: Maintains `customers` array. Executes immutable updates (`[new, ...prev]` or `.map()`). Syncs to storage on state change.
3. **Filter/Sort Hook (`useCustomerFilterSort.ts`)**: Decouples UI search, status/department filters, multi-field sorting, and pagination into memoized selectors.
4. **Presentation & Modals (`App.tsx`)**: Controls modal and drawer visibility. Triggers toast feedback upon successful mutations or errors.

---

## 🏃 Instructions to Run, Test, and Build

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation
Navigate to the project directory:
```bash
cd react-customer-management
npm install
```

### Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Run Test Suite (Vitest + React Testing Library)
Run all 29 automated tests:
```bash
npm test
```

Or run tests in watch mode:
```bash
npm run test:watch
```

### Production Build & Type Check
Verify TypeScript compilation and create optimized distribution bundle:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

---

## 🧪 Verified Test Execution Results

All test suites execute and pass cleanly:

```text
 ✓ src/test/storage.test.ts (6 tests)
   ✓ loads default seed customers when localStorage is empty
   ✓ handles malformed JSON in localStorage gracefully without throwing
   ✓ handles non-array stored data by restoring initial seed data
   ✓ persists and retrieves valid customer updates
   ✓ resets customers back to initial defaults when requested
   ✓ generates the next sequential ID accurately

 ✓ src/test/validation.test.ts (9 tests)
   ✓ accepts standard valid email addresses
   ✓ rejects invalid email formats
   ✓ accepts standard phone numbers with 7 to 15 digits
   ✓ rejects phone numbers that are too short or invalid
   ✓ passes for complete, valid customer data
   ✓ catches missing required fields
   ✓ prevents duplicate customer IDs
   ✓ allows keeping the same ID when editing the existing customer
   ✓ rejects invalid email and phone in form submission

 ✓ src/test/useCustomerFilterSort.test.ts (6 tests)
   ✓ filters customers by search query (name or email)
   ✓ filters customers by status
   ✓ filters customers by department
   ✓ sorts customers by name ascending and descending
   ✓ handles pagination correctly
   ✓ resets all filters when resetFilters is invoked

 ✓ src/test/CustomerCRUD.test.tsx (8 tests)
   ✓ renders initial dashboard with seed customers and statistics
   ✓ validates required fields when creating a customer
   ✓ validates email and phone formats during creation
   ✓ successfully creates a new customer and displays in table
   ✓ edits an existing customer successfully
   ✓ requires confirmation before deleting a customer
   ✓ opens and closes the customer details drawer
   ✓ supports empty state when searching for nonexistent query

Test Files:  4 passed (4)
Tests:       29 passed (29)
Duration:    2.36s
```

---

## 💡 Technical Interview Talking Points

When explaining this application in an interview:
1. **Immutable State Updates**: Point to `useCustomers.ts`. State updates never mutate the array in place; they return new array references (`[newCustomer, ...prev]` or `.map()`), guaranteeing predictable re-renders and preventing subtle bugs.
2. **Separation of Presentation & Business Logic**: Highlight how `CustomerTable` has zero awareness of how items are filtered or persisted; it simply accepts `paginatedCustomers` and dispatches callbacks (`onView`, `onEdit`, `onDelete`, `onSort`).
3. **Resilience to Corrupt LocalStorage**: Explain the `loadCustomers()` implementation in `services/storage.ts`. A common bug in hackathons is an app crashing on refresh if someone pastes invalid JSON in `localStorage`. Here, a `try/catch` and `isValidCustomer` validator ensure fallback to default seed data.
4. **Keyboard & Screen-Reader Accessibility**:
   - Inputs are linked to error messages via `aria-describedby`.
   - Modals trap/restore focus and close on `Escape`.
   - Column headers use `aria-sort="ascending" | "descending" | "none"`.
5. **Debounce / Performance Considerations**: For larger datasets, `useMemo` protects against re-filtering on unrelated state changes (like opening a modal). Filtering and sorting run only when `customers`, `searchQuery`, `statusFilter`, `departmentFilter`, or sort criteria change.
