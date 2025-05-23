import { COLOR_CLASSES, Icon, SIZE_CLASSES } from '@components/svg';

export const ChevronDown = ({ color, size, className, fillColor }: Icon) => {
  const height = 24;
  const width = 24;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`chevron-down fill-black ${className}`}
      style={{
        fill: fillColor,
      }}
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.32951 9.3295C6.76884 8.89017 7.48116 8.89017 7.9205 9.3295L12 13.409L16.0795 9.32951C16.5188 8.89017 17.2312 8.89017 17.6705 9.32951C18.1098 9.76885 18.1098 10.4812 17.6705 10.9205L12.7955 15.7955C12.3562 16.2348 11.6438 16.2348 11.2045 15.7955L6.3295 10.9205C5.89016 10.4812 5.89017 9.76884 6.32951 9.3295Z"
        fill={fillColor}
      ></path>
    </svg>
  );
};

ChevronDown.defaultProps = {
  color: 'default',
  size: 'sm',
};
