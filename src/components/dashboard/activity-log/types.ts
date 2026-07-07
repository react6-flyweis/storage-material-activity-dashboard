import { Shield, TrendingUp, Hammer, Factory, Wallet, User } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface LastPage {
  panel: string;
  page: string;
  visitedAt: string;
}

export interface PanelActivity {
  lastVisitedAt: string;
  lastPage: string;
}

export interface Panels {
  admin: PanelActivity | null;
  sales: PanelActivity | null;
  construction: PanelActivity | null;
  plant: PanelActivity | null;
  account: PanelActivity | null;
}

export interface UserActivity {
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'sales' | 'construction' | 'plant' | 'account' | 'customer';
  panel: string;
  lastActiveAt: string | null;
  lastPage: LastPage | null;
  panels: Panels;
  isActive?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse {
  items: UserActivity[];
  pagination: Pagination;
}

export interface RoleConfigItem {
  label: string;
  color: string;
  icon: LucideIcon;
}

export const ROLE_CONFIG: Record<UserActivity['role'], RoleConfigItem> = {
  admin: { label: "Admin", color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/30", icon: Shield },
  sales: { label: "Sales", color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30", icon: TrendingUp },
  construction: { label: "Construction", color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30", icon: Hammer },
  plant: { label: "Plant", color: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/30", icon: Factory },
  account: { label: "Account", color: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30", icon: Wallet },
  customer: { label: "Customer", color: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/30", icon: User }
};

export const PANEL_LABELS: Record<keyof Panels, string> = {
  admin: "Admin",
  sales: "Sales",
  construction: "Construction",
  plant: "Plant",
  account: "Account"
};
