"use client"

import React, { useEffect, useRef } from 'react';

const AdminConsoleWrapper: React.FC = () => {
  const adminConsoleRef = useRef<HTMLDivElement>(null);
  const isAppendedRef = useRef(false);

  useEffect(() => {
    import('@/components/admin-console').then(({ default: AdminConsole }) => {
      const adminConsole = new AdminConsole();
      if (adminConsoleRef.current && !isAppendedRef.current) {
        adminConsoleRef.current.appendChild(adminConsole);
        isAppendedRef.current = true;
      }
    });
  }, []);

  return <div ref={adminConsoleRef}></div>;
};

const ConsolePage: React.FC = () => (
  <div>
    <AdminConsoleWrapper />
  </div>
);

export default ConsolePage;