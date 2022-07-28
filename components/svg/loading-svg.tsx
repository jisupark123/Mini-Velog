import React from 'react';

interface Props {
  width: number;
  speed?: 'fast' | 'normal' | 'slow'; // defalut 'normal'
  thickness?: 'thick' | 'normal' | 'slim'; // defalut 'normal'
}
const LoadingSvg: React.FC<Props> = ({ width, speed, thickness }) => {
  const rotationSpeed = speed === 'fast' ? 0.5 : speed === 'slow' ? 0.9 : 0.7;
  const svgThickness = thickness === 'thick' ? 4 : thickness === 'slim' ? 2 : 3;
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      style={{
        background: 'inherit',
        display: 'block',
        shapeRendering: 'auto',
      }}
      width={`${width}px`}
      height={`${width}px`}
      viewBox='0 0 100 100'
      preserveAspectRatio='xMidYMid'
    >
      <circle
        cx='50'
        cy='50'
        fill='none'
        stroke='#6610f2'
        strokeWidth='4'
        r='19'
        strokeDasharray='89.5353906273091 31.845130209103033'
      >
        <animateTransform
          attributeName='transform'
          type='rotate'
          repeatCount='indefinite'
          dur={`${rotationSpeed}s`}
          // dur='0.9900990099009901s'
          values='0 50 50;360 50 50'
          keyTimes='0;1'
        ></animateTransform>
      </circle>
    </svg>
  );
};

export default LoadingSvg;
