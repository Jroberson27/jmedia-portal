import { AuthProvider } from '../context/AuthContext';
import { BrandProvider } from '../context/BrandContext';
import '../styles/globals.css';
export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <BrandProvider>
        <Component {...pageProps} />
      </BrandProvider>
    </AuthProvider>
  );
}