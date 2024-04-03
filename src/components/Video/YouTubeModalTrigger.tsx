import { ExternalLink } from 'lucide-react';
import type { YouTubeVideoItem } from '@/app/actions/youtubeFetch';
import Blog from '@/components/Blog/Blog';
import ButtonNewTab from '@/components/Button/ButtonNewTab';
import YouTubeIcon from '@/components/Icons/YouTubeIcon';
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

interface YouTubeModalTriggerProps {
  videoData: YouTubeVideoItem;
}

export function YouTubeModalTrigger({
  videoData,
}: YouTubeModalTriggerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Blog
          thumbnail={videoData.snippet.thumbnails.maxres.url}
          title={videoData.snippet.title}
          description="sample description"
          date={videoData.snippet.publishedAt}
          tags={[]}
        />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-[90vw] gap-0 overflow-hidden rounded-md bg-primary-foreground p-4">
        <DialogHeader className="justify-start p-4 text-left">
          <DialogTitle className="text-2xl font-bold tablet:text-3xl">
            {videoData.snippet.title}
          </DialogTitle>
          <DialogDescription className="text-base font-medium tablet:text-lg">
            sample description
          </DialogDescription>
          <DialogDescription>
            <ButtonNewTab
              href={`https://www.youtube.com/channel/${videoData.snippet.channelId}`}
              className="flex w-fit items-center gap-2 text-lg font-medium text-primary hover:underline tablet:text-xl"
            >
              <YouTubeIcon className="size-7" />
              {videoData.snippet.channelTitle}
              <ExternalLink
                size={20}
                className="text-primary"
              />
            </ButtonNewTab>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="size-full max-h-[60vh] p-4">
          <YouTubeModalContent videoId={videoData.id} />
        </ScrollArea>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
