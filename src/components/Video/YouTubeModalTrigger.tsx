import { ExternalLink } from 'lucide-react';
import YouTubeIcon from '@/components/Icons/YouTubeIcon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  //   DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import YouTubeModalContent from './YouTubeModalContent';

export function YouTubeModalTrigger() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-[90vw] gap-0 overflow-hidden rounded-md bg-primary-foreground p-0">
        <DialogHeader className="justify-start p-4 text-left">
          <DialogTitle className="text-2xl font-bold tablet:text-3xl">Title</DialogTitle>
          <DialogDescription className="text-base font-medium tablet:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis blandit.
          </DialogDescription>
          <DialogDescription className="flex items-center gap-2 text-lg font-medium text-primary tablet:text-xl">
            <YouTubeIcon className="size-7" />
            Author
            <ExternalLink
              size={20}
              className="text-primary"
            />
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="size-full max-h-[60vh] p-4">
          <YouTubeModalContent />
        </ScrollArea>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
