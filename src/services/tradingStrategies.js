export function sma(prices, period) {
  if (prices.length < period) return null;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

export function ema(prices, period) {
  if (prices.length < period) return null;
  const k = 2 / (period + 1);
  let val = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) val = prices[i] * k + val * (1 - k);
  return val;
}

export function rsi(prices, period = 14) {
  if (prices.length < period + 1) return null;
  const changes = prices.slice(1).map((p, i) => p - prices[i]);
  let avgGain = changes.slice(0, period).filter(c => c > 0).reduce((a, b) => a + b, 0) / period;
  let avgLoss = changes.slice(0, period).filter(c => c < 0).reduce((a, b) => a + Math.abs(b), 0) / period;
  for (let i = period; i < changes.length; i++) {
    const g = Math.max(0, changes[i]);
    const l = Math.max(0, -changes[i]);
    avgGain = (avgGain * (period - 1) + g) / period;
    avgLoss = (avgLoss * (period - 1) + l) / period;
  }
  return avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
}

export function macd(prices, fast = 12, slow = 26, signal = 9) {
  if (prices.length < slow + signal) return null;
  const macdLine = ema(prices, fast) - ema(prices, slow);
  const macdHistory = [];
  for (let i = slow; i <= prices.length; i++) {
    const f = ema(prices.slice(0, i), fast);
    const s = ema(prices.slice(0, i), slow);
    if (f !== null && s !== null) macdHistory.push(f - s);
  }
  const signalLine = ema(macdHistory, signal);
  return { macdLine, signalLine, histogram: macdLine - (signalLine ?? 0) };
}

export class SMACrossover {
  constructor({ shortPeriod = 7, longPeriod = 25 } = {}) {
    this.shortPeriod = shortPeriod;
    this.longPeriod = longPeriod;
    this.id = 'sma_crossover';
    this.name = `SMA Crossover (${shortPeriod}/${longPeriod})`;
  }

  analyze(prices) {
    if (prices.length < this.longPeriod + 1) return { signal: 'HOLD', reason: 'Zu wenig Daten', indicators: {} };
    const shortNow = sma(prices, this.shortPeriod);
    const longNow = sma(prices, this.longPeriod);
    const shortPrev = sma(prices.slice(0, -1), this.shortPeriod);
    const longPrev = sma(prices.slice(0, -1), this.longPeriod);
    const indicators = { shortSMA: shortNow, longSMA: longNow };

    if (shortPrev <= longPrev && shortNow > longNow)
      return { signal: 'BUY', reason: `SMA${this.shortPeriod} kreuzte SMA${this.longPeriod} nach oben`, indicators };
    if (shortPrev >= longPrev && shortNow < longNow)
      return { signal: 'SELL', reason: `SMA${this.shortPeriod} kreuzte SMA${this.longPeriod} nach unten`, indicators };
    return { signal: 'HOLD', reason: `Kein Crossover — SMA${this.shortPeriod}: ${shortNow?.toFixed(2)}, SMA${this.longPeriod}: ${longNow?.toFixed(2)}`, indicators };
  }
}

export class RSIStrategy {
  constructor({ period = 14, oversold = 30, overbought = 70 } = {}) {
    this.period = period;
    this.oversold = oversold;
    this.overbought = overbought;
    this.id = 'rsi';
    this.name = `RSI (${period})`;
  }

  analyze(prices) {
    const rsiVal = rsi(prices, this.period);
    const indicators = { rsi: rsiVal };
    if (rsiVal === null) return { signal: 'HOLD', reason: 'Zu wenig Daten', indicators };
    if (rsiVal < this.oversold) return { signal: 'BUY', reason: `RSI ${rsiVal.toFixed(1)} < ${this.oversold} (überverkauft)`, indicators };
    if (rsiVal > this.overbought) return { signal: 'SELL', reason: `RSI ${rsiVal.toFixed(1)} > ${this.overbought} (überkauft)`, indicators };
    return { signal: 'HOLD', reason: `RSI ${rsiVal.toFixed(1)} im neutralen Bereich`, indicators };
  }
}

export class MACDStrategy {
  constructor({ fast = 12, slow = 26, signal: sig = 9 } = {}) {
    this.fast = fast;
    this.slow = slow;
    this.signal = sig;
    this.id = 'macd';
    this.name = `MACD (${fast}/${slow}/${sig})`;
  }

  analyze(prices) {
    if (prices.length < this.slow + this.signal + 2) return { signal: 'HOLD', reason: 'Zu wenig Daten', indicators: {} };
    const now = macd(prices, this.fast, this.slow, this.signal);
    const prev = macd(prices.slice(0, -1), this.fast, this.slow, this.signal);
    const indicators = { macdLine: now?.macdLine, signalLine: now?.signalLine, histogram: now?.histogram };

    if (!now || !prev) return { signal: 'HOLD', reason: 'Zu wenig Daten', indicators };
    if (prev.histogram <= 0 && now.histogram > 0)
      return { signal: 'BUY', reason: `MACD Histogram wurde positiv (${now.histogram?.toFixed(4)})`, indicators };
    if (prev.histogram >= 0 && now.histogram < 0)
      return { signal: 'SELL', reason: `MACD Histogram wurde negativ (${now.histogram?.toFixed(4)})`, indicators };
    return { signal: 'HOLD', reason: `MACD Histogram: ${now.histogram?.toFixed(4)}`, indicators };
  }
}

export const STRATEGIES = {
  sma_crossover: SMACrossover,
  rsi: RSIStrategy,
  macd: MACDStrategy,
};

export const STRATEGY_DEFAULTS = {
  sma_crossover: { shortPeriod: 7, longPeriod: 25 },
  rsi: { period: 14, oversold: 30, overbought: 70 },
  macd: { fast: 12, slow: 26, signal: 9 },
};
