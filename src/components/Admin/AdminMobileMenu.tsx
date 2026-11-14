'use client';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AdminNavigation } from '@/components/Admin/AdminNavigation';
import type { Kind } from '@/src/cms/schema';

// 720px 이하 관리자 메뉴 서랍
export const AdminMobileMenu = ({ pending }: { pending: Partial<Record<Kind, number>> }) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          className="cms-button cms-secondary tablet:hidden"
          aria-label="관리 메뉴"
        >
          <Menu size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 overflow-y-auto bg-[var(--cms-surface)] p-0 pt-10">
        <SheetTitle className="px-6 pb-2 text-base">콘텐츠 관리</SheetTitle>
        <AdminNavigation pending={pending} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};
