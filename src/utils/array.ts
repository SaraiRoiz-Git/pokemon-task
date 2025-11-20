/**
 * Gets random elements from an array without duplicates
 * More efficient than shuffling entire array - only does 'count' swaps
 */
export const getRandomElements = <T>(array: T[], count: number): T[] => {
  const result = [...array];
  const length = result.length;

  // Partial Fisher-Yates: only shuffle first 'count' elements
  for (let i = 0; i < Math.min(count, length); i++) {
    const j = i + Math.floor(Math.random() * (length - i));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.slice(0, count);
};
