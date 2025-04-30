import type { Metadata } from "next";
import "../(global)/globals.css";

export const metadata: Metadata = {
  title: "Admin - My Blog",
  description: "Admin dashboard for the blog",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="admin-layout">
        <div className="admin-container">
          <header className="admin-header">
            <h1>Admin Dashboard</h1>
          </header>
          <main className="admin-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
} 