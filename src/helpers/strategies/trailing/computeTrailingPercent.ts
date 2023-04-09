import { Indicator, ATR } from 'technicalindicators';

const trailingStopMultiplier = 2; // multiplier for the dynamic stop loss distance
let trailingStopPercent = 0.02; // initial trailing stop percentage
let position = null; // current position in the market
let stopLossPrice = null; // current stop loss price

// Calculate the dynamic stop loss distance based on the current market conditions
function calculateStopLossDistance(priceData: number[]): number {
  const atr = Indicator.calculate({ period: 14, values: priceData, indicator: new ATR() });
  const stopLossDistance = atr[atr.length - 1] * trailingStopMultiplier;
  return stopLossDistance;
}

// Update the trailing stop percentage based on the current market conditions
function updateTrailingStopPercent(priceData: number[]): void {
  const stopLossDistance = calculateStopLossDistance(priceData);
  const currentPrice = priceData[priceData.length - 1];
  trailingStopPercent = stopLossDistance / currentPrice;
}

// Buy position with trailing stop loss
function buyWithTrailingStop(price: number): void {
  const stopLossDistance = trailingStopPercent * price;
  stopLossPrice = price - stopLossDistance;
  position = 'long';
}

// Sell position with trailing stop loss
function sellWithTrailingStop(price: number): void {
  const stopLossDistance = trailingStopPercent * price;
  stopLossPrice = price + stopLossDistance;
  position = 'short';
}

// Update the stop loss price based on the current market conditions
function updateStopLossPrice(price: number): void {
  if (position === 'long') {
    const stopLossDistance = trailingStopPercent * price;
    stopLossPrice = Math.max(stopLossPrice, price - stopLossDistance);
  } else if (position === 'short') {
    const stopLossDistance = trailingStopPercent * price;
    stopLossPrice = Math.min(stopLossPrice, price + stopLossDistance);
  }
}

// Check if the stop loss has been triggered and close the position if necessary
function checkStopLoss(price: number): void {
  if (position === 'long' && price <= stopLossPrice) {
    position = null;
    stopLossPrice = null;
  } else if (position === 'short' && price >= stopLossPrice) {
    position = null;
    stopLossPrice = null;
  }
}

// Example usage
const priceData = [100, 110, 120, 130, 140, 150, 140, 130, 120, 110, 100];
for (let i = 0; i < priceData.length; i++) {
  const price = priceData[i];
  updateTrailingStopPercent(priceData.slice(0, i + 1));
  if (position === null) {
    buyWithTrailingStop(price);
  } else {
    updateStopLossPrice(price);
    checkStopLoss(price);
  }
  console.log(`Price: ${price}, Position: ${position}, Stop Loss Price: ${stopLossPrice}, Trailing Stop Percent: ${trailingStopPercent}`);
}
