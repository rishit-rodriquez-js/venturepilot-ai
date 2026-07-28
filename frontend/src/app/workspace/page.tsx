"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVentureStore } from '@/lib/store';

export default function WorkspaceIndexPage() {
  const router = useRouter();
  const { activeProject, projects } = useVentureStore();

  useEffect(() => {
    if (activeProject?.id) {
      router.replace(`/workspace/${activeProject.id}`);
    } else if (projects.length > 0) {
      router.replace(`/workspace/${projects[0].id}`);
    } else {
      router.replace('/dashboard');
    }
  }, [router, activeProject, projects]);

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center font-semibold text-xs text-[#64748B]">
      Redirecting to Venture Workspace...
    </div>
  );
}
