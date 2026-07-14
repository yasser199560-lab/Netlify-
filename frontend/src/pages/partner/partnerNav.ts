// Shared sidebar nav for every partner-panel page, so the active-link
// highlighting in DashboardShell stays in sync no matter which page
// renders it.
export const partnerNavItems = [
  { label: "Dashboard", to: "/partner", icon: "ti-layout-dashboard" },
  { label: "My items", to: "/partner/items", icon: "ti-box" },
  { label: "Orders", to: "/partner/orders", icon: "ti-file-text" },
  { label: "Store profile", to: "/partner/profile", icon: "ti-building-store" },
  { label: "Settings", to: "/partner/settings", icon: "ti-settings" },
];
