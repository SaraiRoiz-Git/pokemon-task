export const getRandomElements = <T>(array: T[], count: number): T[] => {
  const result = [...array];
  const length = result.length;

  // shuffle only the first 'count' elements
  for (let i = 0; i < Math.min(count, length); i++) {
    const j = Math.floor(Math.random() * (length - i));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.slice(0, count);
};
