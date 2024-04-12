import NextTopLoader from 'nextjs-toploader';
import React from 'react';

const ClientLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <NextTopLoader color="#2563eb" showSpinner={false} />
    {children}
  </>
);

export default ClientLayout;
