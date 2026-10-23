'use client';
import { Copy } from '@/components/Text/PublicSite';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// 현재 테마 선택과 키보드 초점 표시
export const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="relative bg-control text-white hover:bg-control-hover">
          <Sun className="size-5 dark:hidden" />
          <Moon className="hidden size-5 dark:block" />
          <span className="sr-only">
            <Copy id="copy.6026719f081a" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">
            <Copy id="copy.dbcd5e7bb7a0" />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Copy id="copy.60acc53f13a5" />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Copy id="copy.6725e7bbcd28" />
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
