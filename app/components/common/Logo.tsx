import Link from 'next/link';
import styles from './Logo.module.scss';

export default function Logo() {
  return (
    <div className={styles.logo}>
      <Link href="/">
        <span className={styles.logoText}>DokaLab</span>
      </Link>
    </div>
  );
} 