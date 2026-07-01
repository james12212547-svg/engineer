/**
 * Calculates the required BTU and recommended AC size based on room dimensions and exposure.
 * @param {number} width - Room width in meters
 * @param {number} length - Room length in meters
 * @param {string} roomType - Type of room ('bedroom', 'living', 'office')
 * @param {string} sunExposure - Sun exposure ('normal', 'high')
 * @returns {object|null} - Result object containing area, calculatedBTU, and recommendedSize, or null if input is invalid
 */
export const calculateBtuSizing = (width, length, roomType, sunExposure) => {
  const w = parseFloat(width);
  const l = parseFloat(length);
  if (isNaN(w) || isNaN(l) || w <= 0 || l <= 0) return null;

  const area = w * l;
  
  // Base multiplier based on room type
  let multiplier = 750; 
  if (roomType === 'bedroom') multiplier = 700;
  if (roomType === 'living') multiplier = 800;
  if (roomType === 'office') multiplier = 900;

  // Sun exposure adjustment
  if (sunExposure === 'high') {
    multiplier += 100;
  }

  const calculatedBTU = Math.ceil(area * multiplier);
  
  // Recommend standard BTU sizes
  let recommendedSize = 9000;
  const sizes = [9000, 12000, 15000, 18000, 24000, 30000, 36000, 42000, 48000];
  
  for (let size of sizes) {
    if (calculatedBTU <= size) {
      recommendedSize = size;
      break;
    }
  }
  if (calculatedBTU > 48000) recommendedSize = calculatedBTU;

  return {
    area: area.toFixed(1),
    calculatedBTU,
    recommendedSize
  };
};
