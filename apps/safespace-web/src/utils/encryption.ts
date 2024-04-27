import CryptoJS from "crypto-js";

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

export const generateSymmetricKey = () => {
  // AES requires a key that can be 128, 192, or 256 bits long; here we use 256 bits.
  return CryptoJS.lib.WordArray.random(256 / 8).toString(CryptoJS.enc.Hex);
};

// Function to encrypt JSON data
export const encryptJson = (jsonData: Record<string, unknown>, key: string) => {
  const dataString = JSON.stringify(jsonData);
  const encrypted = CryptoJS.AES.encrypt(dataString, key);
  return encrypted.toString();
};

export const encryptString = (data: string, key: string) => {
  const encrypted = CryptoJS.AES.encrypt(data, key);
  return encrypted.toString();
};

// Function to decrypt data
export const decryptJson = (encryptedData: string, key: string) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
  const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedString);
};

export const decryptString = (encryptedData: string, key: string) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
};
