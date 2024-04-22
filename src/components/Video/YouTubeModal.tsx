import { ExternalLink } from 'lucide-react';
import { ImageWrapper } from '@/components/Blog/Blog';
import ButtonNewTab from '@/components/Button/ButtonNewTab';
import YouTubeIcon from '@/components/Icons/YouTubeIcon';
import Tag from '@/components/Tag/Tag';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { YouTubeVideoItem } from '@/src/types';
import { formatDate } from '@/src/util/utils';

interface YouTubeModalProps {
  videoData: YouTubeVideoItem;
}

export function YouTubeModal({ videoData }: YouTubeModalProps) {
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
            <div className="flex items-center justify-between">
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
      <DialogContent className="max-w-[50vw] gap-0 rounded-md bg-primary-foreground p-4">
        <DialogHeader className="justify-start p-4 text-left">
          <DialogTitle className="text-2xl font-bold tablet:text-3xl">
            {videoData.snippet.title}
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
              {videoData.snippet.channelTitle}
              <ExternalLink size={20} className="text-primary" />
            </ButtonNewTab>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="size-full max-h-[40vh] p-4">
          <p className="whitespace-pre-wrap text-lg font-medium">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin
            libero nunc consequat interdum varius sit amet mattis. Praesent
            semper feugiat nibh sed pulvinar proin gravida hendrerit. Eget magna
            fermentum iaculis eu. Viverra adipiscing at in tellus integer
            feugiat scelerisque. Urna duis convallis convallis tellus id
            interdum velit laoreet. Sed velit dignissim sodales ut. Amet risus
            nullam eget felis eget nunc. Tellus orci ac auctor augue mauris
            augue. In cursus turpis massa tincidunt dui ut ornare lectus sit. Ut
            faucibus pulvinar elementum integer enim neque volutpat ac
            tincidunt.
            {'\n\n'}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin
            libero nunc consequat interdum varius sit amet mattis. Praesent
            semper feugiat nibh sed pulvinar proin gravida hendrerit. Eget magna
            fermentum iaculis eu. Viverra adipiscing at in tellus integer
            feugiat scelerisque. Urna duis convallis convallis tellus id
            interdum velit laoreet. Sed velit dignissim sodales ut. Amet risus
            nullam eget felis eget nunc. Tellus orci ac auctor augue mauris
            augue. In cursus turpis massa tincidunt dui ut ornare lectus sit. Ut
            faucibus pulvinar elementum integer enim neque volutpat ac
            tincidunt.
            {'\n\n'}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin
            libero nunc consequat interdum varius sit amet mattis. Praesent
            semper feugiat nibh sed pulvinar proin gravida hendrerit. Eget magna
            fermentum iaculis eu. Viverra adipiscing at in tellus integer
            feugiat scelerisque. Urna duis convallis convallis tellus id
            interdum velit laoreet. Sed velit dignissim sodales ut. Amet risus
            nullam eget felis eget nunc. Tellus orci ac auctor augue mauris
            augue. In cursus turpis massa tincidunt dui ut ornare lectus sit. Ut
            faucibus pulvinar elementum integer enim neque volutpat ac
            tincidunt.
          </p>
        </ScrollArea>
        <DialogFooter className="justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
