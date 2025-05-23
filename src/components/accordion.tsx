import { Disclosure } from '@headlessui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import { cn } from '@src/lib/helpers/helper';

export type AccordionItem = {
  location?: string;
  title: string;
  content: React.ReactNode;
  isOpen?: boolean;
};

type Props = {
  data: AccordionItem[];
  titleClassname?: string;
  contentClassname?: string;
  tabTitleStyle?: React.CSSProperties;
  tabsCase?: string;
};

// Helper function to replace YouTube links with iframe
import React from 'react';

const processContent = (content: React.ReactNode): React.ReactNode => {
  if (typeof content === 'string') {
    const youtubeRegex =
      /(https?:\/\/(?:www\.)?(youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+))/g;

    // Replace YouTube links with iframe and remove the link from the content
    return content
      .split(youtubeRegex)
      .map((part, index) => {
        if (youtubeRegex.test(part)) {
          const videoIdMatch = part.match(
            /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
          );
          const videoId = videoIdMatch ? videoIdMatch[1] : null;
          if (videoId) {
            return (
              <iframe
                key={index}
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ minHeight: '50vh' }}
              ></iframe>
            );
          }
        }
        // Skip the YouTube link part (return null for it)
        return part.trim() ? part : null;
      })
      .filter(Boolean); // Remove null values from the array
  }

  // If content is an array, process each child recursively
  if (Array.isArray(content)) {
    return content.map((child, index) => (
      <React.Fragment key={index}>{processContent(child)}</React.Fragment>
    ));
  }

  // If content is a React element, process its children recursively
  if (React.isValidElement(content)) {
    return React.cloneElement(content, {
      ...(content.props.children && { children: processContent(content.props.children) }),
    });
  }

  // Return content as is for other types
  return content;
};

export const Accordion: React.FC<Props> = ({
  data,
  tabTitleStyle,
  titleClassname,
  contentClassname,
  tabsCase,
}) => {
  return (
    <>
      {data.map((tab, index) => (
        <Disclosure
          as="div"
          defaultOpen={tab.isOpen}
          className={cn('accordion-holder')}
          key={tab.title}
        >
          {({ open }) => (
            <>
              <Disclosure.Button
                as="h3"
                id={tab.title}
                className={cn(`accordion-title ${titleClassname}`)}
              >
                <span
                  className={cn('', {
                    uppercase: tabsCase === '2',
                  })}
                  style={tabTitleStyle}
                >
                  {tab.title}
                </span>
                <span className="accordion-button">
                  {open ? (
                    <FiChevronUp
                      width="8"
                      height="8"
                    />
                  ) : (
                    <FiChevronDown
                      width="8"
                      height="8"
                    />
                  )}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel
                as="div"
                className="w-full"
              >
                <div
                  className={`tab-content w-full border-b border-brand-second-gray py-6 tab-${tab.title.toLowerCase()} ${contentClassname}`}
                >
                  {processContent(tab.content)}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </>
  );
};
