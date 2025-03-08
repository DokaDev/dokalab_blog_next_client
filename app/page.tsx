import { AuthButtons } from './components/auth/AuthButtons';
import { ApiTestButtons } from './components/api/ApiTestButtons';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>JWT Authentication Test</h1>
      <p className={styles.description}>
        Log in with the test account using the form below.<br />
        Email: test@example.com / Password: password
      </p>
      <AuthButtons />
      
      <ApiTestButtons />
      
      <div className={styles.info}>
        <h2>JWT Authentication Implementation Details</h2>
        <ul>
          <li>AccessToken (30 seconds) + RefreshToken (1 minute)</li>
          <li>Both tokens are issued upon login</li>
          <li>Access token is automatically refreshed when less than 10 seconds remaining</li>
          <li>Token status check runs every 15 seconds</li>
          <li>Tokens stored in LocalStorage (HttpOnly cookies recommended for production)</li>
        </ul>
        <p className={styles.note}>
          Check your browser console for detailed token management logs
        </p>
      </div>
    </main>
  );
}
