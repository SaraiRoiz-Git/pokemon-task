/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param array - The array to shuffle
 * @returns A new shuffled array (does not mutate original)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Gets random elements from an array
 * @param array - The source array
 * @param count - Number of random elements to get
 * @returns Array of random elements
 */
export const getRandomElements = <T>(array: T[], count: number): T[] => {
  return shuffleArray(array).slice(0, count);
};
