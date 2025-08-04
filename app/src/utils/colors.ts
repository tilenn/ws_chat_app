const COLORS = [
  "bg-cyan-500",
  "bg-green-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-orange-500",
];

/**
 * Creates a consistent color from a predefined list based on the hash of a string.
 * @param {string} username - The input string, e.g., a username.
 * @returns {string} A Tailwind CSS background color class.
 */
export const getColorForUser = (username: string): string => {
  if (!username) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};
