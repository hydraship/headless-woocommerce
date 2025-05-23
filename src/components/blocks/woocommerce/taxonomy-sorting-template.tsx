import { ParsedBlock } from '@src/components/blocks';
import { Content } from '@src/components/blocks/content';

import { useTaxonomyContext } from '@src/context/taxonomy-context';
import { cn } from '@src/lib/utils';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useContentContext } from '@src/context/content-context';

export const TaxonomySortingTemplate = ({ block }: { block: ParsedBlock }) => {
  const taxonomyCtx = useTaxonomyContext();
  const { data } = useContentContext();
  const [sortByOpen, setSortByOpen] = taxonomyCtx.slideOverSort;
  const position: 'left' | 'right' = 'right';
  return (
    <Transition.Root
      show={sortByOpen}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-30"
        onClose={setSortByOpen}
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div
          className="fixed inset-0 bg-black/30"
          aria-hidden="true"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={cn('pointer-events-none fixed inset-y-0 flex max-w-full', {
                // 'left-0 pr-10': position === 'left',
                'right-0 pl-10': position === 'right',
              })}
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom={cn({
                  // '-translate-x-full': position === 'left',
                  'translate-x-full': position === 'right',
                })}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo={cn({
                  // '-translate-x-full': position === 'left',
                  'translate-x-full': position === 'right',
                })}
              >
                <Dialog.Panel className="pointer-events-auto w-96">
                  <div
                    className={cn(
                      'flex h-full flex-col overflow-y-auto bg-white shadow-xl',
                      block.attrs?.className
                    )}
                  >
                    <Content
                      type="product"
                      globalData={{
                        ...data,
                        actions: {
                          setSortByOpen,
                        },
                      }}
                      content={block.innerBlocks}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
