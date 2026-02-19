export function calculateTimer(progress) {
  let timer = 11 - progress;
  if (timer === 0) {
    timer = 1;
  }
  return timer;
}

export function sortChakrasByProgress(chakras, progressValues) {
  return chakras.slice().sort((a, b) => {
    const aProgress = progressValues[chakras.indexOf(a)];
    const bProgress = progressValues[chakras.indexOf(b)];
    return aProgress - bProgress;
  });
}
