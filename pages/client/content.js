import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';
import Layout from '../../components/Layout';
import ClientPortal from '../../components/views/ClientPortal';
export default function Page() {
  const { user, loading } = useAuth();
  const { applyClientBrand } = useBrand();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace('/');
    if (!loading && user?.role !== 'client') router.replace('/admin/dashboard');
    if (!loading && user?.clientId) applyClientBrand(user.clientId);
  }, [user,loading]);
  if (loading || !user) return null;
  return <Layout title="Content Library"><ClientPortal clientId={user.clientId} defaultTab="content" /></Layout>;
}