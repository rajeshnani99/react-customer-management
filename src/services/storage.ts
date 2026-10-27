import { Customer } from '../types/customer';

export const STORAGE_KEY = 'rcm_customers_v1';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-1001',
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberdyne.io',
    phone: '+1 (555) 234-5678',
    department: 'Engineering',
    status: 'Active',
    notes: 'Key stakeholder for infrastructure security migration.',
    createdAt: '2026-01-15T09:30:00.000Z',
    updatedAt: '2026-01-15T09:30:00.000Z',
  },
  {
    id: 'CUST-1002',
    name: 'Marcus Vance',
    email: 'm.vance@apexlogistics.com',
    phone: '+1 (555) 876-5432',
    department: 'Operations',
    status: 'Active',
    notes: 'Managing fleet routing integration and supply chain sync.',
    createdAt: '2026-02-01T14:15:00.000Z',
    updatedAt: '2026-02-10T11:00:00.000Z',
  },
  {
    id: 'CUST-1003',
    name: 'Elena Rostova',
    email: 'elena@novafinance.org',
    phone: '+1 (555) 345-6789',
    department: 'Finance',
    status: 'Pending',
    notes: 'Reviewing enterprise billing SLA terms and automated invoicing.',
    createdAt: '2026-02-14T16:45:00.000Z',
    updatedAt: '2026-02-14T16:45:00.000Z',
  },
  {
    id: 'CUST-1004',
    name: 'David Chen',
    email: 'david.chen@horizonmedia.net',
    phone: '+1 (555) 901-2345',
    department: 'Marketing',
    status: 'Lead',
    notes: 'Prospective client interested in omni-channel tracking analytics.',
    createdAt: '2026-02-20T10:00:00.000Z',
    updatedAt: '2026-02-20T10:00:00.000Z',
  },
  {
    id: 'CUST-1005',
    name: 'Amara Okafor',
    email: 'amara.okafor@zenithenterprise.co',
    phone: '+1 (555) 456-7890',
    department: 'Sales',
    status: 'Active',
    notes: 'Quarterly account review scheduled next month; 99.9% uptime requirement.',
    createdAt: '2026-02-22T08:20:00.000Z',
    updatedAt: '2026-02-25T15:30:00.000Z',
  },
  {
    id: 'CUST-1006',
    name: 'Liam Gallagher',
    email: 'liam.g@soundwave-audio.co.uk',
    phone: '+44 20 7946 0912',
    department: 'Support',
    status: 'Inactive',
    notes: 'Account suspended pending contract renewal and payment method update.',
    createdAt: '2026-03-01T12:00:00.000Z',
    updatedAt: '2026-03-05T09:10:00.000Z',
  },
  {
    id: 'CUST-1007',
    name: 'Priya Patel',
    email: 'priya.patel@quantumsys.in',
    phone: '+91 98200 12345',
    department: 'Product',
    status: 'Active',
    notes: 'Early adopter program member for next-gen telemetry dashboards.',
    createdAt: '2026-03-10T11:20:00.000Z',
    updatedAt: '2026-03-12T14:40:00.000Z',
  },
  {
    id: 'CUST-1008',
    name: 'Julian Moretti',
    email: 'julian@vanguardcloud.eu',
    phone: '+39 02 6977 1234',
    department: 'Engineering',
    status: 'Pending',
    notes: 'Awaiting SAML SSO certificate verification.',
    createdAt: '2026-03-15T13:10:00.000Z',
    updatedAt: '2026-03-15T13:10:00.000Z',
  },
  {
    id: 'CUST-1009',
    name: 'Nadia Solis',
    email: 'nadia.solis@solardrive.io',
    phone: '+1 (555) 789-0123',
    department: 'Operations',
    status: 'Active',
    notes: 'Green energy compliance partner. In need of custom audit exports.',
    createdAt: '2026-03-18T17:00:00.000Z',
    updatedAt: '2026-03-19T10:15:00.000Z',
  },
  {
    id: 'CUST-1010',
    name: 'Tobias Becker',
    email: 't.becker@berlin-dynamics.de',
    phone: '+49 30 12345678',
    department: 'Sales',
    status: 'Lead',
    notes: 'Met at European Tech Summit. Requested enterprise RFP demo.',
    createdAt: '2026-03-22T09:00:00.000Z',
    updatedAt: '2026-03-22T09:00:00.000Z',
  },
  {
    id: 'CUST-1011',
    name: 'Chloe Tremblay',
    email: 'chloe@montrealai.ca',
    phone: '+1 (514) 555-0199',
    department: 'Product',
    status: 'Inactive',
    notes: 'Trial expired; re-engagement campaign queued for Q3.',
    createdAt: '2026-03-25T14:00:00.000Z',
    updatedAt: '2026-03-28T16:20:00.000Z',
  },
  {
    id: 'CUST-1012',
    name: 'Kenji Sato',
    email: 'kenji.sato@tokyomicro.jp',
    phone: '+81 3 5555 0143',
    department: 'Engineering',
    status: 'Active',
    notes: 'High-volume API integration with SLA priority support.',
    createdAt: '2026-03-29T08:30:00.000Z',
    updatedAt: '2026-03-30T10:00:00.000Z',
  },
];

/**
 * Validates whether an unknown item conforms to basic Customer shape
 */
function isValidCustomer(item: unknown): item is Customer {
  if (!item || typeof item !== 'object') return false;
  const c = item as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    c.id.trim().length > 0 &&
    typeof c.name === 'string' &&
    typeof c.email === 'string' &&
    typeof c.phone === 'string' &&
    typeof c.department === 'string' &&
    typeof c.status === 'string'
  );
}

/**
 * Loads customers from localStorage with fallback to initial mock data.
 * Handles malformed JSON, corrupted structures, and empty storage gracefully.
 */
export function loadCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveCustomers(INITIAL_CUSTOMERS);
      return INITIAL_CUSTOMERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('Storage data is not an array, falling back to initial data.');
      saveCustomers(INITIAL_CUSTOMERS);
      return INITIAL_CUSTOMERS;
    }

    const validCustomers = parsed.filter(isValidCustomer);
    if (validCustomers.length === 0 && parsed.length > 0) {
      console.warn('Storage data contained no valid customer records, restoring seeds.');
      saveCustomers(INITIAL_CUSTOMERS);
      return INITIAL_CUSTOMERS;
    }

    return validCustomers;
  } catch (error) {
    console.error('Failed to parse customers from localStorage:', error);
    saveCustomers(INITIAL_CUSTOMERS);
    return INITIAL_CUSTOMERS;
  }
}

/**
 * Persists customer records to localStorage safely.
 */
export function saveCustomers(customers: Customer[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    return true;
  } catch (error) {
    console.error('Failed to save customers to localStorage:', error);
    return false;
  }
}

/**
 * Resets storage back to default seed customers.
 */
export function resetCustomers(): Customer[] {
  saveCustomers(INITIAL_CUSTOMERS);
  return INITIAL_CUSTOMERS;
}

/**
 * Generates the next sequential ID (e.g. CUST-1013) avoiding conflicts.
 */
export function generateNextCustomerId(existingCustomers: Customer[]): string {
  let highestNum = 1000;
  for (const c of existingCustomers) {
    const match = c.id.match(/^CUST-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > highestNum) {
        highestNum = num;
      }
    }
  }
  return `CUST-${highestNum + 1}`;
}
