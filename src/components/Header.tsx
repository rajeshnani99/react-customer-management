import React from 'react';
import { Button } from './common/Button';

interface HeaderProps {
  totalCount: number;
  onAddClick: () => void;
  onResetClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  onAddClick,
  onResetClick,
}) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="brand-logo" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="28"
            height="28"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <h1 className="app-title">CustomerHub</h1>
          <p className="app-subtitle">
            Enterprise Client Directory &bull; {totalCount} total account{totalCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="header-actions">
        <Button
          variant="outline"
          size="sm"
          onClick={onResetClick}
          title="Restore original sample customers"
          leftIcon={
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          }
        >
          Reset Mock Data
        </Button>
        <Button
          variant="primary"
          onClick={onAddClick}
          leftIcon={
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          }
        >
          Add Customer
        </Button>
      </div>
    </header>
  );
};
