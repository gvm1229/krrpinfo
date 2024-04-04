import { ExternalLink } from 'lucide-react';
import type { YouTubeVideoItem } from '@/app/actions/youtubeFetch';
import { ImageWrapper } from '@/components/Blog/Blog';
import ButtonNewTab from '@/components/Button/ButtonNewTab';
import YouTubeIcon from '@/components/Icons/YouTubeIcon';
import Tag from '@/components/Tag/Tag';
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
import { formatDate } from '@/src/util/utils';
import YouTubeModalContent from './YouTubeModalContent';

interface YouTubeModalProps {
  videoData: YouTubeVideoItem;
}

export function YouTubeModal({
  videoData,
}: YouTubeModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Blog as Trigger only */}
        <div className="pointer-events-none relative focus:outline-none">
          <ImageWrapper
            src={videoData.snippet.thumbnails.maxres.url}
            alt="youtube thumbnail"
            gridNums={[1, 2, 3]}
            isPriority={false}
            isHyperlink={false}
            className="pointer-events-auto cursor-pointer"
          />
          <div className="group mt-4 space-y-2 text-left">
            <div
              className="flex items-center justify-between"
            >
              <p
                id="date"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-300"
              >
                {formatDate(videoData.snippet.publishedAt ?? new Date())}
              </p>
            </div>
            <h1
              id="title"
              className="pointer-events-auto cursor-pointer truncate text-2xl font-bold text-primary hover:underline"
            >
              {videoData.snippet.title}
            </h1>
            {videoData.snippet.description && (
              <p className="truncate font-medium text-zinc-600 dark:text-zinc-200">
                sample description
              </p>
            )}
            <Tag tagInput={[]} />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-[90vw] gap-0 overflow-hidden rounded-md bg-primary-foreground p-4">
        <DialogHeader className="justify-start p-4 text-left">
          <DialogTitle className="text-2xl font-bold tablet:text-3xl">
            {/* {videoData.snippet.title} */}
            Sample title
          </DialogTitle>
          <DialogDescription className="text-base font-medium tablet:text-lg">
            Sample description
          </DialogDescription>
          <DialogDescription>
            <ButtonNewTab
              href={`https://www.youtube.com/channel/${videoData.snippet.channelId}`}
              className="flex w-fit items-center gap-2 text-lg font-medium text-primary hover:underline tablet:text-xl"
            >
              <YouTubeIcon className="flex size-7 items-center justify-center" />
              {/* {videoData.snippet.channelTitle} */}
              Sample author
              <ExternalLink
                size={20}
                className="text-primary"
              />
            </ButtonNewTab>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="size-full max-h-[70vh] p-4">
          <YouTubeModalContent
            videoId={videoData.id}
          />
        </ScrollArea>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
