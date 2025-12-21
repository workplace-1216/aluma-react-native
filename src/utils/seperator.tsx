import {SvgEllipsisHorizontal, SvgellipsisVertical} from '../assets/svg';

export const TopDottedSeparator = () => (
  <SvgellipsisVertical
    height={100}
    width={30}
    stroke="#999"
    style={{
      position: 'absolute',
      left: '50%',
      top: '-14%',
      transform: [{translateX: -15}], // Half of width to center it
      zIndex: 1,
    }}
  />
);

export const BottomDottedSeparator = () => {
  return (
    <SvgellipsisVertical
      height={100}
      width={30}
      stroke="#999"
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '-14%',
        transform: [{translateX: -15}], // Half of width to center it
        zIndex: 1,
      }}
    />
  );
};

export const LeftDottedSeperator = () => {
  return (
    <SvgEllipsisHorizontal
      style={{
        position: 'absolute',
        left: '-1.5%',
        top: '50%',
        transform: [{translateX: -15}],
        zIndex: 1,
      }}
      width={100}
      height={30}
      stroke="#999"
    />
  );
};

export const RightDottedSeperator = () => {
  return (
    <SvgEllipsisHorizontal
      style={{
        position: 'absolute',
        right: '-28%',
        top: '50%',
        transform: [{translateX: -15}],
        zIndex: 1,
      }}
      width={100}
      height={30}
      stroke="#999"
    />
  );
};
