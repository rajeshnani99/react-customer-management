import React from 'react';
import { Customer } from '../types/customer';

interface StatsOverviewProps {
  customers: Customer[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ customers }) => {
  const total = customers.length;
  const activeCount = customers.filter((c) => c.status === 'Active').length;
  const leadCount = customers.filter((c) => c.status === 'Lead').length;
  const pendingCount = customers.filter((c) => c.status === 'Pending').length;
  const inactiveCount = customers.filter((c) => c.status === 'Inactive').length;

  return (
    <section className="stats-grid" aria-label="Customer summary statistics">
      <div className="stat-card stat-total">
        <div className="stat-icon" aria-hidden="true">
          👥
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Accounts</span>
          <span className="stat-value">{total}</span>
        </div>
      </div>

      <div className="stat-card stat-active">
        <div className="stat-icon" aria-hidden="true">
          🟢
        </div>
        <div className="stat-info">
          <span className="stat-label">Active</span>
          <span className="stat-value">{activeCount}</span>
        </div>
      </div>

      <div className="stat-card stat-lead">
        <div className="stat-icon" aria-hidden="true">
          🟣
        </div>
        <div className="stat-info">
          <span className="stat-label">Leads</span>
          <span className="stat-value">{leadCount}</span>
        </div>
      </div>

      <div className="stat-card stat-pending">
        <div className="stat-icon" aria-hidden="true">
          🟡
        </div>
        <div className="stat-info">
          <span className="stat-label">Pending Review</span>
          <span className="stat-value">{pendingCount}</span>
        </div>
      </div>

      <div className="stat-card stat-inactive">
        <div className="stat-icon" aria-hidden="true">
          ⚪
        </div>
        <div className="stat-info">
          <span className="stat-label">Inactive / Churned</span>
          <span className="stat-value">{inactiveCount}</span>
        </div>
      </div>
    </section>
  );
};
