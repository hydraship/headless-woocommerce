import { BlockComponentProps } from '@src/components/blocks';
import { isBlockNameA } from '@src/lib/block';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { cn } from '@src/lib/utils';
import { useEffect, useState } from 'react';

export const CheckboxGate = ({ block }: BlockComponentProps) => {
  const [showWarning, setShowWarning] = useState(false);

  const className = block.attrs.className;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new MutationObserver(() => {
      const checkbox = document.getElementById('checkbox-gate') as HTMLInputElement | null;
      const button = document.querySelector(
        '.checkbox-gate form button'
      ) as HTMLButtonElement | null;
      const form = document.querySelector('.checkbox-gate form') as HTMLFormElement | null;

      if (!checkbox || !button || !form) return;

      // Attach event listeners once everything is found
      const handleClick = (e: MouseEvent) => {
        if (!checkbox.checked) {
          e.preventDefault();
          button.setAttribute('disabled', '');
          setShowWarning(true);
        } else {
          setShowWarning(false);
          button.removeAttribute('disabled');
        }
      };

      const handleFormSubmit = (e: SubmitEvent) => {
        if (!checkbox.checked) {
          e.preventDefault();
          button.setAttribute('disabled', '');
          setShowWarning(true);
        } else {
          setShowWarning(false);
          button.removeAttribute('disabled');
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          if (!checkbox.checked) {
            e.preventDefault();
            button.setAttribute('disabled', '');
            setShowWarning(true);
          } else {
            setShowWarning(false);
            button.removeAttribute('disabled');
          }
        }
      };

      const handleCheckboxChange = () => {
        if (checkbox.checked) {
          setShowWarning(false);
          button.removeAttribute('disabled');
        }
      };

      button.addEventListener('mousedown', handleClick);
      form.addEventListener('submit', handleFormSubmit);
      form.addEventListener('keydown', handleKeyDown);
      checkbox.addEventListener('change', handleCheckboxChange);

      // Disconnect observer once we've found and hooked into everything
      observer.disconnect();

      // Cleanup
      return () => {
        button.removeEventListener('mousedown', handleClick);
        form.removeEventListener('submit', handleFormSubmit);
        form.removeEventListener('keydown', handleKeyDown);
        checkbox.removeEventListener('change', handleCheckboxChange);
      };
    });

    // Observe the entire body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  if (!isBlockNameA(block, 'CheckboxGate')) {
    return null;
  }

  return (
    <>
      <label className={cn(className)}>
        <input
          type="checkbox"
          id="checkbox-gate"
          className={cn({
            'border-2 border-red-500 p-1 mt-2': showWarning,
          })}
        />
        {block.innerBlocks.map((innerBlock, index) => {
          if (isBlockNameA(innerBlock, 'CheckBox')) {
            return (
              <ReactHTMLParser
                key={index}
                html={innerBlock.innerHTML}
              />
            );
          }
          if (innerBlock.blockName === 'core/paragraph') {
            return (
              <ReactHTMLParser
                key={index}
                html={innerBlock.innerHTML}
              />
            );
          }
          return null;
        })}
      </label>
      {showWarning && (
        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="w-5 h-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">Please check the box before proceeding.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
