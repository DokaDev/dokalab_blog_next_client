"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.scss";

export default function AdminDashboardPage() {
  useEffect(() => {
    // Admin page initialization logic goes here
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Admin Dashboard</h2>
      <div className={styles.actionCard}>
        <h3>Content Management</h3>
        <div className={styles.actionLinks}>
          <Link href="/admin/editor" className={styles.actionLink}>
            markdown editor
          </Link>
          {/* Additional links */}
        </div>
      </div>
    </div>
  );
}

