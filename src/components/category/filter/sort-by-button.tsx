import { ParsedBlock } from '@src/components/blocks';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { cn } from '@src/lib/helpers/helper';

type TProps = {
  setSortByOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSortOption: { label: string; value: string };
  className?: string;
  block?: ParsedBlock;
};
export const SortByButton = (props: TProps) => {
  const { setSortByOpen, selectedSortOption } = props;

  return (
    <div className="group/sortby">
      <button
        onClick={() => {
          setSortByOpen((prev) => !prev);
        }}
        className={cn('button-sort-by', props.className)}
      >
        <ReactHTMLParser html={selectedSortOption?.label || 'Sort by'} />
        {/* <ChevronDown /> */}
      </button>
    </div>
  );
};
export const SortByButtonIcon = (props: TProps) => {
  const { setSortByOpen, block } = props;
  if (!block?.innerHTML) return null;
  return (
    <div className={cn('group/sortby flex justify-center', block.attrs.className)}>
      <button
        onClick={() => {
          setSortByOpen((prev) => !prev);
        }}
        className={cn('button-sort-by', props.className)}
      >
        <span>SORT BY:</span>
        {<ReactHTMLParser html={block.innerHTML} />}
      </button>
    </div>
  );
};
