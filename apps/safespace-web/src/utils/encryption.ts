export const animateTextChange = (
  setText: (text: string) => void,
  finalText: string,
  isEncrypting = true,
) => {
  const iterations = 10;
  const interval = 50;

  // Helper function to generate a random character
  const randomCharacter = (originalChar: string) => {
    if (/[a-zA-Z]/.test(originalChar)) {
      // Create a random mix of uppercase, lowercase, and special characters
      const types = [
        () => String.fromCharCode(33 + Math.random() * 15), // Special chars ! to /
        () => String.fromCharCode(65 + Math.random() * 26), // Uppercase A-Z
        () => String.fromCharCode(97 + Math.random() * 26), // Lowercase a-z
      ];
      const func = types[Math.floor(Math.random() * types.length)];

      if (func) {
        return func();
      }
    } else {
      return originalChar; // Keep non-alphabetic characters unchanged
    }
  };

  for (let i = 0; i < iterations; i++) {
    setTimeout(() => {
      const randomText = Array.from(finalText)
        .map((char) => randomCharacter(char))
        .join("");
      setText(randomText);
    }, i * interval);
  }

  // Set the final gibberish or original text after all iterations
  setTimeout(() => {
    if (isEncrypting) {
      const encryptedText = Array.from(finalText)
        .map((char) => randomCharacter(char))
        .join("");
      setText(encryptedText);
    } else {
      setText(finalText);
    }
  }, iterations * interval);
};
