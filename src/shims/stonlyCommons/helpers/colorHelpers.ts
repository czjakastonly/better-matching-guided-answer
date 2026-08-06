export const hexToRgb = (hex: string): string => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};

export const blendColors = (c0: string, c1: string, p: number): string => {
  if (!c0) return '';
  const f = Number.parseInt(c0.slice(1), 16);
  const t = Number.parseInt(c1.slice(1), 16);
  const R1 = f >> 16;
  const G1 = (f >> 8) & 0xff;
  const B1 = f & 0xff;
  const R2 = t >> 16;
  const G2 = (t >> 8) & 0xff;
  const B2 = t & 0xff;
  return `#${(
    0x1000000 +
    (Math.round((R2 - R1) * p) + R1) * 0x10000 +
    (Math.round((G2 - G1) * p) + G1) * 0x100 +
    (Math.round((B2 - B1) * p) + B1)
  )
    .toString(16)
    .slice(1)}`;
};
