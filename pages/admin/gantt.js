import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import GanttChart from '../../components/views/GanttChart';
export default function Page() {
  const { user, loading } = useAuth(); const router = useRouter();
  useEffect(() => { if (!loading && (!user || user.role !== 'admin')) router.replace('/'); }, [user,loading]);
  if (loading || !user) return null;
  return <Layout title="Project Timeline"><GanttChart /></Layout>;
}