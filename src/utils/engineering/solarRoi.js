/**
 * Calculates Solar ROI and system sizing.
 * @param {string} calcMode - 'bill' (monthly bill in Baht) or 'load' (daily load in kWh)
 * @param {number|string} inputValue - The value corresponding to calcMode
 * @returns {object|null} - Result object or null if input is invalid
 */
export const calculateSolarRoi = (calcMode, inputValue) => {
  const value = parseFloat(inputValue);
  if (isNaN(value) || value <= 0) {
    return null; // Return null to indicate error
  }

  let recommendedKW = 0;
  let actualSavingsPerMonth = 0;
  const PSH = 4; // Peak Sun Hours for Thailand (avg 4-4.5 hrs)
  const panelWattage = 550; // Standard 550W panel
  const costPerKW = 25000; // Estimated cost per kW in Baht

  if (calcMode === 'bill') {
    // Mode: Calculate from Monthly Bill
    // Assumptions: 1 kW solar generates ~4 units/day = 120 units/month = 600 Baht/month savings (at 5 Baht/unit)
    const targetSavings = value * 0.7; // Aim to cover 70% of bill
    recommendedKW = targetSavings / 600;
    
    // Round to standard sizes (3kW, 5kW, 10kW)
    if (recommendedKW <= 3) recommendedKW = 3;
    else if (recommendedKW <= 5) recommendedKW = 5;
    else if (recommendedKW <= 10) recommendedKW = 10;
    else recommendedKW = Math.ceil(recommendedKW);

    actualSavingsPerMonth = recommendedKW * 600;

  } else {
    // Mode: Calculate from Daily Load (kWh/day)
    // If user needs 53.92 kWh/day, the system size should be Daily Load / PSH
    recommendedKW = value / PSH;
    // We don't snap to 3/5/10 here to give exact sizing for engineering purposes
    recommendedKW = Number(recommendedKW.toFixed(2));
    
    // Savings = kWh * 5 Baht * 30 days
    actualSavingsPerMonth = (recommendedKW * PSH) * 5 * 30;
  }

  // Common calculations based on recommendedKW
  const totalWatts = recommendedKW * 1000;
  const numberOfPanels = Math.ceil(totalWatts / panelWattage);
  const inverterSize = Math.ceil(recommendedKW); // Round up to next whole kW for inverter
  
  const actualSavingsPerYear = actualSavingsPerMonth * 12;
  const estimatedCost = recommendedKW * costPerKW;
  const paybackYears = (estimatedCost / actualSavingsPerYear).toFixed(1);
  const requiredArea = numberOfPanels * 2.6; // ~2.6 sqm per 550W panel

  return {
    recommendedKW,
    numberOfPanels,
    panelWattage,
    inverterSize,
    actualSavingsPerMonth,
    actualSavingsPerYear,
    estimatedCost,
    paybackYears,
    requiredArea: requiredArea.toFixed(1)
  };
};
