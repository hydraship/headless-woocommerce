import { Dictionary } from '@reduxjs/toolkit';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { cn } from '@src/lib/utils';

type Props = {
  classes: string;
  text: string;
  config?: Dictionary<string>;
};

const Wrapper: React.FC<{
  style?: string;
  styleColor?: string;
  children: React.ReactNode;
}> = ({
  style,
  styleColor,
  children,
}: {
  style?: string;
  styleColor?: string;
  children: React.ReactNode;
}) => {
  if (style === 'style-1') {
    return (
      <div className={cn('relative inline-block', style)}>
        <span style={{ backgroundColor: styleColor }} />
        {children}
        <span style={{ backgroundColor: styleColor }} />
      </div>
    );
  }

  return <div>{children}</div>;
};

export const Text = ({ classes, text, config }: Props) => {
  const classNames = cn(classes, 'text-block');
  const isCopyRightFooter = text?.includes('©');
  const fontColor = classes?.match(/text-\[(.*)\]/)?.pop();
  const textStyle = {
    color: fontColor ? fontColor : '',
    marginTop: classes?.match(/marginTop-\[(.*)\]/)?.pop(),
  };

  return (
    <div
      className={classNames}
      style={textStyle}
    >
      <Wrapper
        style={config?.style}
        styleColor={config?.styleColor}
      >
        <ReactHTMLParser
          html={
            text?.concat(
              isCopyRightFooter
                ? ' By <a href="https://blazecommerce.io/" target="_blank" >Blaze Commerce</a>'
                : ''
            ) || ''
          }
        />
      </Wrapper>
    </div>
  );
};
