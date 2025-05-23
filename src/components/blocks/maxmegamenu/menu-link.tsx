import styled from 'styled-components';
import { useRef } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import type { BoxControlProps } from '@components/blocks/maxmegamenu/block';
import Link from 'next/link';
import { cn } from '@src/lib/utils';
import { useMenuLink } from '@src/hooks/useMenuLink';

type StyledMenuProps = {
  $padding?: BoxControlProps;
  $color?: string;
  $colorSm?: string;
  $backgroundColor?: string;
  $fontWeight?: string;
  $fontSize?: number;
  $letterCase?: string;
  $hoverColor?: string;
  $hoverBackgroundColor?: string;
  $activeColor?: string;
  $activeBackgroundColor?: string;
};

export const StyledMenuLink = styled(Link)<StyledMenuProps>`
  ${(props) => {
    if (!props.$padding) return null;

    const { top, left, right, bottom } = props.$padding || {};

    return `
      padding-top: ${top};
      padding-left: ${left};
      padding-right: ${right};
      padding-bottom: ${bottom};
    `;
  }}

  color: ${(props) => props.$colorSm || props.$color || '#000'};
  font-weight: ${(props) => props.$fontWeight || '400'};
  font-size: ${(props) => (props.$fontSize ? `${props.$fontSize}px` : '14px')};
  ${(props) => props.$letterCase && `text-transform:${props.$letterCase}`};

  &.active {
    color: ${(props) => props.$activeColor || props.$hoverColor} !important;
    svg.chevron-down {
      fill: ${(props) => props.$activeColor || props.$hoverColor} !important;
    }
  }

  svg.chevron-down {
    fill: ${(props) => props.$color || '#000'};
  }

  @media (min-width: 1024px) {
    color: ${(props) => props.$color || '#000'};
    background-color: ${(props) => props.$backgroundColor || '#fff'};

    &:hover {
      color: ${(props) => props.$hoverColor || '#000'};
      background-color: ${(props) => props.$hoverBackgroundColor || '#fff'};

      svg.chevron-down {
        fill: ${(props) => props.$hoverColor || '#000'};
        transform: rotate(180deg);
      }
    }

    &.active {
      color: ${(props) => props.$activeColor || props.$hoverColor} !important;
      background-color: ${(props) => props.$activeBackgroundColor || props.$hoverBackgroundColor} !important;
      svg.chevron-down {
        fill: ${(props) => props.$activeColor || props.$hoverColor} !important;
      }
    }
  }
`;

type Props = React.LinkHTMLAttributes<HTMLAnchorElement> & StyledMenuProps;

export const MenuLink: React.FC<Props> = ({ children, href, onClick, as, ...props }) => {
  // Use our custom hook for link management
  const { relativeLink, isActive } = useMenuLink(href as string);

  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
      e.preventDefault();
    }
  };

  // Check if active colors are provided
  const hasActiveColors = props.$activeColor || props.$activeBackgroundColor;

  // Only apply active class if link is active and we have active colors or hover colors as fallback
  const shouldApplyActive = isActive && (hasActiveColors || props.$hoverColor || props.$hoverBackgroundColor);

  return (
    <div
      ref={ref}
      className="menu-link h-full"
    >
      <StyledMenuLink
        href={relativeLink}
        onClick={handleClick}
        {...props}
        className={cn('h-full', shouldApplyActive && 'active', props.className)}
      >
        {children}
      </StyledMenuLink>
    </div>
  );
};
