import { useCountUp } from '../../hooks/useCountUp';

interface CountUpProps {
  target: number;
  duration?: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  startOnMount?: boolean;
  style?: React.CSSProperties;
}

export function CountUp({
  target,
  duration,
  decimals,
  className = '',
  prefix = '',
  suffix = '',
  startOnMount,
  style,
}: CountUpProps) {
  const { value, ref } = useCountUp({ target, duration, decimals, startOnMount });
  const formatted =
    decimals && decimals > 0
      ? value.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : value.toLocaleString();

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
