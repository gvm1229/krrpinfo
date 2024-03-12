'use client';

import { useEffect } from 'react';

function ViewReporter({ slug }: { slug: string }) {
  useEffect(() => {
    fetch('/api/viewcount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug }),
    });
  }, [slug]);

  return null;
}

export default ViewReporter;
