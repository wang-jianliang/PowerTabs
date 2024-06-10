export function convertVwVhToPixels(value) {
  const parts = value.match(/([0-9.]+)(vh|vw)/);
  const amount = parseFloat(parts[1]);
  const unit = parts[2];

  if (unit === 'vh') {
    return (amount * window.innerHeight) / 100;
  } else if (unit === 'vw') {
    return (amount * window.innerWidth) / 100;
  }
}
