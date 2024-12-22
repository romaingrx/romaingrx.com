function colorFromHash(hash: string): [string, string] {
  // Simple hash function
  const hashValue = hash.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Generate two colors from the hash
  const color1 = `hsl(${hashValue % 360}, 70%, 20%)`;
  const color2 = `hsl(${(hashValue * 2) % 360}, 70%, 40%)`;

  return [color1, color2];
}

export default colorFromHash;
