"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/app" && pathname?.startsWith(href));

  return (
    <Link className={`side-link ${active ? "side-link-active" : ""}`} href={href}>
      {label}
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar-card">
        <div className="sidebar-title">Workspace</div>
        <div className="sidebar-nav">
          <NavLink href="/app" label="Overview" />
          <NavLink href="/app/decide" label="New decision" />
          <NavLink href="/app/focus" label="Daily focus" />
          <NavLink href="/app/history" label="History" />
          <NavLink href="/app/login" label="Login" />
        </div>
      </aside>

      <section className="app-main">{children}</section>
    </div>
  );
}
