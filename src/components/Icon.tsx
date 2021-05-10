import { FunctionComponent, SVGAttributes } from 'react';

export interface IconProps {
  width: number;
  height: number;
  icon: FunctionComponent<SVGAttributes<SVGElement>>;
  top?: number;
}

export default function Icon(props: IconProps): JSX.Element {
  const { icon: IconComponent, height, width, top = 0 } = props;
  return (
    <IconComponent
      width={width}
      height={height}
      style={{ display: 'block', position: 'relative', top }}
    />
  );
}
