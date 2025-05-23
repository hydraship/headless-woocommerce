import { BlockComponentProps } from '@src/components/blocks';
import { cn } from '@src/lib/utils';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaYoutube,
  FaPinterest,
  FaLinkedin,
  FaReddit,
  FaSnapchat,
  FaTwitch,
  FaWhatsapp,
  FaTelegram,
  FaGithub,
  FaSpotify,
  FaAmazon,
  FaEtsy,
  FaVimeo,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export const SocialLink = ({ block }: BlockComponentProps) => {
  if (block.blockName !== 'core/social-link') {
    return null;
  }

  const { attrs } = block;
  const url = attrs.url as string;
  const service = attrs.service as string;
  const label = attrs.label as string;

  // If no URL is provided, don't render anything
  if (!url) {
    return null;
  }

  // Map of social media services to their respective icons
  const serviceIcons: Record<string, JSX.Element> = {
    facebook: <FaFacebook />,
    instagram: <FaInstagram />,
    twitter: <FaTwitter />,
    x: <FaXTwitter />,
    tiktok: <FaTiktok />,
    youtube: <FaYoutube />,
    pinterest: <FaPinterest />,
    linkedin: <FaLinkedin />,
    reddit: <FaReddit />,
    snapchat: <FaSnapchat />,
    twitch: <FaTwitch />,
    whatsapp: <FaWhatsapp />,
    telegram: <FaTelegram />,
    github: <FaGithub />,
    spotify: <FaSpotify />,
    amazon: <FaAmazon />,
    etsy: <FaEtsy />,
    vimeo: <FaVimeo />,
  };

  // Get the icon for the service, or default to null if not found
  const icon = service && serviceIcons[service] ? serviceIcons[service] : null;

  // If no icon is found for the service, don't render anything
  if (!icon) {
    return null;
  }

  // Get parent's color variable if available
  const iconColorStyle = block.attrs.iconColorValue
    ? { color: `var(--social-icon-color, ${block.attrs.iconColorValue as string})` }
    : {};

  return (
    <li className="block rounded-full transition-transform hover:scale-110">
      <a
        href={url}
        className={cn(
          'flex items-center justify-center rounded-full text-inherit no-underline',
          attrs.className as string
        )}
        style={iconColorStyle}
        target={attrs.openInNewTab ? '_blank' : undefined}
        rel={attrs.openInNewTab ? 'noopener noreferrer' : undefined}
        aria-label={label || `${service} link`}
      >
        <span className="flex items-center justify-center">{icon}</span>
        <span className="sr-only">{label || service}</span>
      </a>
    </li>
  );
};
