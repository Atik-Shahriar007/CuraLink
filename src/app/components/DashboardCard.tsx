import { ReactNode } from "react";

interface DashboardCardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({ title, action, children, className = "" }: DashboardCardProps) {
  return (
    <div className={`border border-stone-200 rounded-2xl p-5 bg-white ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="font-semibold text-stone-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}