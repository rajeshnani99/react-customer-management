import React from 'react';
import { CustomerDepartment, CustomerStatus } from '../../types/customer';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'status' | 'department' | 'default';
  status?: CustomerStatus;
  department?: CustomerDepartment;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  status,
  department,
  className = '',
}) => {
  let badgeClass = 'badge';

  if (variant === 'status' && status) {
    switch (status) {
      case 'Active':
        badgeClass += ' badge-status-active';
        break;
      case 'Inactive':
        badgeClass += ' badge-status-inactive';
        break;
      case 'Pending':
        badgeClass += ' badge-status-pending';
        break;
      case 'Lead':
        badgeClass += ' badge-status-lead';
        break;
    }
  } else if (variant === 'department' && department) {
    badgeClass += ` badge-dept-${department.toLowerCase()}`;
  } else {
    badgeClass += ' badge-default';
  }

  return <span className={`${badgeClass} ${className}`}>{children}</span>;
};
