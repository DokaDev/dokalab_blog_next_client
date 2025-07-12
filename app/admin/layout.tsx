import type { Metadata } from "next";
import "../(global)/globals.scss";
import AdminLayout from "../components/admin/layout/Layout";

export const metadata: Metadata = {
  title: "Admin - My Blog",
  description: "Admin dashboard for the blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="admin-layout">
        <AdminLayout>
          {children}
        </AdminLayout>
      </body>
    </html>
  );
} 