import { Clock, ChevronDown, ChevronUp, User } from "lucide-react"
import type { UserActivity, Panels } from "./types"
import { ROLE_CONFIG, PANEL_LABELS } from "./types"

interface ActivityTableRowProps {
  userItem: UserActivity;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function ActivityTableRow({
  userItem,
  isExpanded,
  onToggleExpand
}: ActivityTableRowProps) {
  // Format relative time helper
  const formatRelativeTime = (dateString: string | null): string => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 10) return "Just now"
    if (diffSecs < 60) return `${diffSecs}s ago`
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  // Format full date for tooltips
  const formatFullDate = (dateString: string | null): string => {
    if (!dateString) return "No activity history"
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    })
  }

  // Mask sensitive email slightly
  const maskEmail = (email: string): string => {
    const [name, domain] = email.split("@")
    if (!name || !domain) return email
    if (name.length <= 2) return `*@${domain}`
    return `${name[0]}***${name[name.length - 1]}@${domain}`
  }

  const roleInfo = ROLE_CONFIG[userItem.role] || { label: userItem.role, color: "bg-neutral-100 text-neutral-850", icon: User };
  const RoleIcon = roleInfo.icon;
  const nameInitials = userItem.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const userPanels = (Object.keys(PANEL_LABELS) as Array<keyof Panels>).filter((panelKey) => {
    if (userItem.role === "admin") return true;
    return panelKey === userItem.role;
  });

  const activePanels = userPanels.filter(
    (panelKey) => !!userItem.panels[panelKey]
  );

  return (
    <>
      {/* Table Row */}
      <tr
        onClick={onToggleExpand}
        className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 cursor-pointer border-b border-neutral-100 dark:border-neutral-850 transition-colors ${
          isExpanded ? "bg-neutral-50/40 dark:bg-neutral-900/10" : ""
        }`}
      >
        {/* User details */}
        <td className="p-3 pl-4">
          <div className="flex items-center gap-3">
            <div className="size-8 shrink-0 rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 flex items-center justify-center font-bold text-xs border border-neutral-200 dark:border-neutral-700 select-none">
              {nameInitials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-neutral-900 dark:text-neutral-50 truncate hover:text-primary transition-colors">
                {userItem.name}
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate" title={userItem.email}>
                {maskEmail(userItem.email)}
              </p>
            </div>
          </div>
        </td>

        {/* Role */}
        <td className="p-3">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${roleInfo.color}`}>
            <RoleIcon className="size-3" />
            {roleInfo.label}
          </span>
        </td>

        {/* Status */}
        <td className="p-3">
          <span className={`inline-flex items-center gap-1.5 text-xs ${userItem.isActive !== false
            ? "text-emerald-600 dark:text-emerald-400 font-medium"
            : "text-neutral-400 dark:text-neutral-500"
            }`}>
            <span className={`size-1.5 rounded-full ${userItem.isActive !== false ? "bg-emerald-500" : "bg-neutral-300 dark:bg-neutral-600"
              }`} />
            {userItem.isActive !== false ? "Active" : "Inactive"}
          </span>
        </td>

        {/* Last Active relative */}
        <td className="p-3 text-neutral-600 dark:text-neutral-400 font-mono text-xs" title={formatFullDate(userItem.lastActiveAt)}>
          {formatRelativeTime(userItem.lastActiveAt)}
        </td>

        {/* Global Last Page */}
        <td className="p-3 max-w-[240px]">
          {userItem.lastPage ? (
            <div className="space-y-0.5 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {userItem.lastPage.panel}
              </div>
              <div className="text-xs font-mono text-neutral-700 dark:text-neutral-300 truncate" title={userItem.lastPage.page}>
                {userItem.lastPage.page}
              </div>
            </div>
          ) : (
            <span className="text-neutral-300 dark:text-neutral-700 font-mono">-</span>
          )}
        </td>

        {/* Panel breakdown indicators */}
        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center gap-1.5">
            {userPanels.map((panelKey) => {
              const panelActivity = userItem.panels[panelKey];
              const hasActivity = !!panelActivity;

              // Color classes per panel style when active
              let activeBadgeStyle = "";
              switch (panelKey) {
                case "admin": activeBadgeStyle = "bg-purple-500/20 text-purple-600 border-purple-500/30 dark:bg-purple-500/30 dark:text-purple-400"; break;
                case "sales": activeBadgeStyle = "bg-emerald-500/20 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/30 dark:text-emerald-400"; break;
                case "construction": activeBadgeStyle = "bg-amber-500/20 text-amber-600 border-amber-500/30 dark:bg-amber-500/30 dark:text-amber-400"; break;
                case "plant": activeBadgeStyle = "bg-indigo-500/20 text-indigo-600 border-indigo-500/30 dark:bg-indigo-500/30 dark:text-indigo-400"; break;
                case "account": activeBadgeStyle = "bg-rose-500/20 text-rose-600 border-rose-500/30 dark:bg-rose-500/30 dark:text-rose-400"; break;
              }

              const shortLabel = panelKey.slice(0, 2).toUpperCase();

              return (
                <div key={panelKey} className="group relative flex items-center justify-center">
                  <span
                    className={`size-6 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${hasActivity
                      ? `${activeBadgeStyle} cursor-help`
                      : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200/40 dark:border-neutral-800 text-neutral-300 dark:text-neutral-700 opacity-40 select-none"
                      }`}
                  >
                    {shortLabel}
                  </span>

                  {/* CSS Tooltip on Hover */}
                  <div className="pointer-events-none absolute bottom-full mb-2 z-30 hidden w-52 rounded-lg bg-neutral-900 p-2.5 text-xs text-neutral-100 shadow-xl group-hover:block dark:bg-neutral-800 border border-neutral-700/50 dark:border-neutral-700/60 leading-normal">
                    <div className="font-semibold text-neutral-500 dark:text-neutral-400 flex items-center justify-between pb-1 border-b border-neutral-800/80 dark:border-neutral-700/60">
                      <span className="capitalize">{PANEL_LABELS[panelKey]} panel</span>
                      {hasActivity && <span className="text-[10px] text-emerald-400 font-medium">Visited</span>}
                    </div>

                    {hasActivity ? (
                      <div className="mt-1.5 space-y-1">
                        <p className="font-mono text-[10px] text-neutral-300 truncate bg-neutral-950 dark:bg-neutral-900/60 p-1 rounded">
                          {panelActivity.lastPage}
                        </p>
                        <p className="text-[10px] text-neutral-400 flex items-center gap-1 font-sans">
                          <Clock className="size-3 inline" />
                          {formatRelativeTime(panelActivity.lastVisitedAt)}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-1 text-[11px] text-neutral-400 italic">No recorded visits in this panel.</p>
                    )}

                    {/* Small arrow triangle */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-900 dark:border-t-neutral-800"></div>
                  </div>
                </div>
              )
            })}
          </div>
        </td>

        {/* Expand chevron actions */}
        <td className="p-3 pr-4 text-right">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </td>
      </tr>

      {/* Expanded details row */}
      {isExpanded && (
        <tr className="bg-neutral-50/30 dark:bg-neutral-900/5">
          <td colSpan={7} className="p-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="max-w-4xl mx-auto rounded-lg border border-neutral-200/70 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 p-4 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Per-Panel Breakdown Timeline &bull; {userItem.name}
                  </h3>
                </div>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                  User ID: {userItem.userId}
                </span>
              </div>

              {activePanels.length > 0 ? (
                <div className="space-y-2">
                  {activePanels.map((panelKey) => {
                    const activity = userItem.panels[panelKey]!;
                    const label = PANEL_LABELS[panelKey];

                    let badgeColor = "";
                    switch (panelKey) {
                      case "admin": badgeColor = "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/30"; break;
                      case "sales": badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30"; break;
                      case "construction": badgeColor = "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30"; break;
                      case "plant": badgeColor = "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/30"; break;
                      case "account": badgeColor = "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30"; break;
                    }

                    return (
                      <div
                        key={panelKey}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-neutral-200/70 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/20 gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border shrink-0 ${badgeColor}`}>
                            {label}
                          </span>
                          <span className="font-mono text-xs text-neutral-800 dark:text-neutral-300 truncate" title={activity.lastPage}>
                            {activity.lastPage}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-450 dark:text-neutral-500 shrink-0 font-mono self-end sm:self-auto">
                          <Clock className="size-3.5" />
                          <span>{formatRelativeTime(activity.lastVisitedAt)}</span>
                          <span className="text-neutral-300 dark:text-neutral-700">|</span>
                          <span>{formatFullDate(activity.lastVisitedAt)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 italic">
                    No recorded panel activity history for this user.
                  </p>
                </div>
              )}

              {userItem.lastPage && (
                <div className="flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/40 p-2.5 rounded-lg text-xs border border-neutral-100 dark:border-neutral-850">
                  <span className="text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-primary" />
                    Most recent active page:
                    <strong className="text-neutral-800 dark:text-neutral-200 capitalize font-semibold ml-0.5">
                      {userItem.lastPage.panel}
                    </strong>
                  </span>
                  <span className="font-mono text-neutral-600 dark:text-neutral-400 select-all truncate max-w-[400px]">
                    {userItem.lastPage.page}
                  </span>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
