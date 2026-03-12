import { useAnimatedNumber } from '../../lib/hooks';
import { FONT } from '../../lib/design';
export default function AnimatedNumber({ target, prefix='', suffix='', duration=1600, color='#fff', fontSize=32 }) {
  const current = useAnimatedNumber(target, duration);
  return <span style={{ fontSize, fontWeight:800, color, letterSpacing:'-0.03em', lineHeight:1, fontFamily:FONT }}>{prefix}{current.toLocaleString()}{suffix}</span>;
}