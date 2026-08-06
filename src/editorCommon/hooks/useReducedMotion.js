import { useReducedMotion as useMotionsReducedMotion } from 'framer-motion';

const isCiEnv = process.env.STONLY_CI === 'true';

export default function useReducedMotion() {
  const isReducedMotion = useMotionsReducedMotion();

  return isReducedMotion || isCiEnv;
}
