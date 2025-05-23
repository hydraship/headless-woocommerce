import { Transition } from '@headlessui/react';
import { cn } from '@src/lib/helpers/helper';
import React, { CSSProperties } from 'react';

type Props = {
  children: React.ReactNode;
  isShowing: boolean;
  className?: string;
  baseTextColor?: string;
  bordered?: boolean;
  setIsShowing: React.Dispatch<React.SetStateAction<boolean>>;
  style: CSSProperties;
};

export const Overlay: React.FC<Props> = ({
  isShowing,
  className,
  children,
  style,
  setIsShowing,
  baseTextColor,
  bordered = true,
}) => {
  const classes = cn('mx-auto flex items-center relative w-full', className);

  // const { asPath } = useRouter();

  // useEffect(() => {
  //   const html = document.body.parentNode as HTMLElement;
  //   html.style.overflow = isShowing ? 'hidden' : 'unset';
  // }, [isShowing]);

  // useUpdateEffect(() => {
  //   setIsShowing(false);
  // }, [asPath]);

  return (
    <Transition.Root
      show={isShowing}
      as={React.Fragment}
    >
      <div className="fixed inset-y-0 inset-x-0 z-50 overlay">
        <Transition.Child
          as={React.Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => setIsShowing(false)}
          ></div>
        </Transition.Child>

        <Transition.Child
          as={React.Fragment}
          enter="transform ease-in-out duration-500 sm:duration-700"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transform ease-in-out duration-500 sm:duration-700"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div
            className="mobile-menu-wrapper mr-10 px-4 max-w-[349px] block h-full relative"
            style={style}
          >
            <div
              className={cn('mobile-menu-header py-4 flex justify-between items-center', {
                'border-b': bordered,
              })}
            >
              <p className="text-gray-950 text-lg font-bold font-secondary">Menu</p>
              <svg
                onClick={() => setIsShowing(false)}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="close-menu"
              >
                <path
                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.16992 14.8299L14.8299 9.16992"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.8299 14.8299L9.16992 9.16992"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div className="overflow-y-auto navbar-overlay-content z-20 h-[calc(100vh-120px)]">
              {children}
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition.Root>
  );
};
