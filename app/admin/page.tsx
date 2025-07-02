"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.scss";

export default function AdminDashboardPage() {
  useEffect(() => {
    // Admin 페이지 초기화 로직을 여기에 작성합니다
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>관리자 대시보드</h2>

      <div className={styles.actionCard}>
        <h3>콘텐츠 관리</h3>
        <div className={styles.actionLinks}>
          <Link href="/admin/editor" className={styles.actionLink}>
            markdown editor
          </Link>
          {/* 추가 링크들 */}
        </div>
      </div>
    </div>
  );
}

