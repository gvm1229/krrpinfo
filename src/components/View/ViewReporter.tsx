'use client';

import { useEffect } from 'react';
import revalidate from '@/app/actions/revalidate';

interface ViewReporterProps {
  slug: string;
  path: string;
}

function ViewReporter({ slug, path }: ViewReporterProps) {
  useEffect(() => {
    fetch('/api/viewcount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug }),
    });
    revalidate(path);
  }, [slug]);

  return null;
}

export default ViewReporter;
