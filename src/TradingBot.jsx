import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  Play, Square, RefreshCw, Settings, TrendingUp, TrendingDown, Minus,
  AlertTriangle, CheckCircle, Clock, DollarSign, BarChart2, List,
  ChevronDown, ChevronUp, Key, Eye, EyeOff,
} from 'lucide-react';
import { BitpandaAPI } from './services/bitpandaApi';
import { STRATEGIES, STRATEGY_DEFAULTS, sma, rsi, macd, ema } from './services/tradingStrategies';

const INSTRUMENTS = ['BTC_EUR', 'ETH_EUR', 'XRP_EUR', 'ADA_EUR', 'SOL_EUR', 'DOT_EUR'];
const CANDLE_UNITS = ['MINUTES', 'HOURS', 'DAYS'];
const CANDLE_PERIODS = { MINUTES: [1, 5, 15, 30], HOURS: [1, 4, 12], DAYS: [1, 3, 7] };

const COLORS = {
  bg: '#0f0f1a',
  panel: '#1a1a2e',
  border: 'rgba(78,205,196,0.2)',
  green: '#4ecdc4',
  orange: '#ff6b35',
  yellow: '#f9ca24',
  red: '#e74c3c',
  purple: '#9b59b6',
  text: 'rgba(255,255,255,0.85)',
  muted: 'rgba(255,255,255,0.45)',
};

function fmt(n, decimals = 2) {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toFixed(decimals);
}

function fmtTime(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleTimeString('de-AT');
}

const SignalBadge = ({ signal }) => {
  const map = {
    BUY: { color: COLORS.green, icon: <TrendingUp size={14} />, label: 'KAUFEN' },
    SELL: { color: COLORS.red, icon: <TrendingDown size={14} />, label: 'VERKAUFEN' },
    HOLD: { color: COLORS.yellow, icon: <Minus size={14} />, label: 'HALTEN' },
  };
  const s = map[signal] || map.HOLD;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, background: `${s.color}22`, border: `1px solid ${s.color}`, color: s.color, fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>
      {s.icon}{s.label}
    </span>
  );
};

const Panel = ({ title, icon, children, style }) => (
  <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '1.25rem', ...style }}>
    {title && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem', color: COLORS.green, fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>
        {icon}{title}
      </div>
    )}
    {children}
  </div>
);

const Label = ({ children }) => (
  <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: 'monospace', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{children}</div>
);

const Value = ({ children, color }) => (
  <div style={{ fontSize: 18, fontWeight: 700, color: color || COLORS.text, fontFamily: 'monospace' }}>{children}</div>
);

const Btn = ({ children, onClick, disabled, variant = 'primary', size = 'md', style }) => {
  const variants = {
    primary: { background: `${COLORS.green}22`, border: `2px solid ${COLORS.green}`, color: COLORS.green },
    danger: { background: `${COLORS.red}22`, border: `2px solid ${COLORS.red}`, color: COLORS.red },
    warning: { background: `${COLORS.orange}22`, border: `2px solid ${COLORS.orange}`, color: COLORS.orange },
    ghost: { background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.muted },
  };
  const sizes = { sm: { padding: '4px 12px', fontSize: 12 }, md: { padding: '8px 18px', fontSize: 13 }, lg: { padding: '12px 24px', fontSize: 15 } };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 8, fontWeight: 700, fontFamily: 'monospace', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, transition: 'all 0.2s', ...variants[variant], ...sizes[size], ...style }}
    >
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = 'text', placeholder, min, max, step }) => (
  <div style={{ marginBottom: '0.75rem' }}>
    {label && <Label>{label}</Label>}
    <input
      type={type}
      value={value}
      onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      placeholder={placeholder}
      min={min} max={max} step={step}
      style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, fontFamily: 'monospace', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: '0.75rem' }}>
    {label && <Label>{label}</Label>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ width: '100%', padding: '8px 12px', background: '#1a1a2e', border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, fontFamily: 'monospace', fontSize: 13, outline: 'none' }}
    >
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </div>
);

export default function TradingBot() {
  // Config state
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('bp_api_key') || '');
  const [showKey, setShowKey] = useState(false);
  const [instrument, setInstrument] = useState('BTC_EUR');
  const [candleUnit, setCandleUnit] = useState('MINUTES');
  const [candlePeriod, setCandlePeriod] = useState(5);
  const [strategyId, setStrategyId] = useState('sma_crossover');
  const [strategyParams, setStrategyParams] = useState({ ...STRATEGY_DEFAULTS.sma_crossover });
  const [tradeAmount, setTradeAmount] = useState(0.001);
  const [paperMode, setPaperMode] = useState(true);
  const [maxOpenTrades, setMaxOpenTrades] = useState(3);
  const [stopLossPct, setStopLossPct] = useState(3);
  const [takeProfitPct, setTakeProfitPct] = useState(6);

  // Runtime state
  const [running, setRunning] = useState(false);
  const [candles, setCandles] = useState([]);
  const [ticker, setTicker] = useState(null);
  const [balances, setBalances] = useState(null);
  const [openOrders, setOpenOrders] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [lastSignal, setLastSignal] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('chart');
  const [paperPositions, setPaperPositions] = useState([]);
  const [paperPnL, setPaperPnL] = useState(0);
  const [activeSection, setActiveSection] = useState('config');

  const intervalRef = useRef(null);
  const apiRef = useRef(null);

  // Save API key
  useEffect(() => { if (apiKey) localStorage.setItem('bp_api_key', apiKey); }, [apiKey]);

  // Build API instance
  useEffect(() => { apiRef.current = new BitpandaAPI(apiKey); }, [apiKey]);

  // Strategy change resets params
  useEffect(() => {
    setStrategyParams({ ...STRATEGY_DEFAULTS[strategyId] });
  }, [strategyId]);

  const addLog = useCallback((msg, type = 'info') => {
    setLogs(prev => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString('de-AT'),
      msg,
      type,
    }, ...prev].slice(0, 100));
  }, []);

  const getStrategy = useCallback(() => {
    const Cls = STRATEGIES[strategyId];
    return new Cls(strategyParams);
  }, [strategyId, strategyParams]);

  const buildChartData = useCallback((candlesData) => {
    const prices = candlesData.map(c => parseFloat(c.close));
    const strategy = getStrategy();

    return candlesData.map((c, i) => {
      const slice = prices.slice(0, i + 1);
      const point = {
        time: fmtTime(c.time),
        price: parseFloat(c.close),
        high: parseFloat(c.high),
        low: parseFloat(c.low),
        volume: parseFloat(c.volume),
      };

      if (strategyId === 'sma_crossover') {
        const sp = strategyParams.shortPeriod || 7;
        const lp = strategyParams.longPeriod || 25;
        point.shortSMA = sma(slice, sp);
        point.longSMA = sma(slice, lp);
      } else if (strategyId === 'rsi') {
        const p = strategyParams.period || 14;
        point.rsi = rsi(slice, p);
      } else if (strategyId === 'macd') {
        const m = macd(slice, strategyParams.fast || 12, strategyParams.slow || 26, strategyParams.signal || 9);
        if (m) { point.macdLine = m.macdLine; point.signalLine = m.signalLine; point.histogram = m.histogram; }
      }

      return point;
    });
  }, [strategyId, strategyParams, getStrategy]);

  const fetchMarketData = useCallback(async () => {
    const api = apiRef.current;
    try {
      const now = new Date();
      const from = new Date(now - 1000 * 60 * 60 * 24).toISOString();
      const [candleData, tickerData] = await Promise.all([
        api.getCandlesticks(instrument, { unit: candleUnit, period: candlePeriod, from }),
        api.getTicker(instrument),
      ]);
      setCandles(candleData);
      setTicker(tickerData);
      setError(null);
      return candleData;
    } catch (e) {
      setError(`Marktdaten: ${e.message}`);
      addLog(`Fehler beim Laden der Marktdaten: ${e.message}`, 'error');
      return null;
    }
  }, [instrument, candleUnit, candlePeriod, addLog]);

  const fetchAccountData = useCallback(async () => {
    if (!apiKey) return;
    const api = apiRef.current;
    try {
      const [bals, orders] = await Promise.all([
        api.getBalances(),
        api.getOrders({ instrumentCode: instrument }),
      ]);
      setBalances(bals.balances);
      setOpenOrders((orders.order_history || []).filter(o => o.order?.status === 'OPEN').map(o => o.order));
    } catch (e) {
      addLog(`Kontodaten: ${e.message}`, 'warn');
    }
  }, [apiKey, instrument, addLog]);

  const executePaperTrade = useCallback((signal, price) => {
    if (signal === 'BUY') {
      const pos = { id: Date.now(), price, amount: tradeAmount, time: new Date().toISOString(), side: 'BUY' };
      setPaperPositions(prev => [...prev, pos]);
      setTradeHistory(prev => [{ ...pos, type: 'open' }, ...prev].slice(0, 50));
      addLog(`[PAPER] KAUF ${tradeAmount} ${instrument.split('_')[0]} @ €${fmt(price)}`, 'buy');
    } else if (signal === 'SELL') {
      setPaperPositions(prev => {
        const closed = prev[0];
        if (!closed) return prev;
        const pnl = (price - closed.price) * closed.amount;
        setPaperPnL(p => p + pnl);
        setTradeHistory(th => [{ ...closed, closePrice: price, pnl, type: 'close', closeTime: new Date().toISOString() }, ...th].slice(0, 50));
        addLog(`[PAPER] VERKAUF @ €${fmt(price)} — P&L: ${pnl >= 0 ? '+' : ''}€${fmt(pnl)}`, pnl >= 0 ? 'buy' : 'sell');
        return prev.slice(1);
      });
    }
  }, [tradeAmount, instrument, addLog]);

  const executeRealTrade = useCallback(async (signal, price) => {
    const api = apiRef.current;
    try {
      const side = signal === 'BUY' ? 'BUY' : 'SELL';
      const order = await api.createOrder({
        instrumentCode: instrument,
        side,
        type: 'MARKET',
        amount: tradeAmount,
      });
      addLog(`ECHTE ORDER ${side} ${tradeAmount} — ID: ${order.order_id}`, signal === 'BUY' ? 'buy' : 'sell');
      await fetchAccountData();
    } catch (e) {
      addLog(`Order-Fehler: ${e.message}`, 'error');
    }
  }, [instrument, tradeAmount, addLog, fetchAccountData]);

  const runBotCycle = useCallback(async () => {
    const candleData = await fetchMarketData();
    if (!candleData || candleData.length === 0) return;

    const prices = candleData.map(c => parseFloat(c.close));
    const strategy = getStrategy();
    const result = strategy.analyze(prices);
    const currentPrice = prices[prices.length - 1];

    setLastSignal({ ...result, price: currentPrice, time: new Date().toISOString() });

    // Stop-Loss / Take-Profit check for paper positions
    setPaperPositions(prev => {
      let updated = [...prev];
      let closedByRisk = 0;
      updated = updated.filter(pos => {
        const change = ((currentPrice - pos.price) / pos.price) * 100;
        if (change <= -stopLossPct) {
          const pnl = (currentPrice - pos.price) * pos.amount;
          setPaperPnL(p => p + pnl);
          addLog(`[STOP-LOSS] Position geschlossen @ €${fmt(currentPrice)} (${fmt(change)}%)`, 'warn');
          closedByRisk++;
          return false;
        }
        if (change >= takeProfitPct) {
          const pnl = (currentPrice - pos.price) * pos.amount;
          setPaperPnL(p => p + pnl);
          addLog(`[TAKE-PROFIT] Position geschlossen @ €${fmt(currentPrice)} (+${fmt(change)}%)`, 'buy');
          closedByRisk++;
          return false;
        }
        return true;
      });
      return updated;
    });

    if (result.signal !== 'HOLD') {
      addLog(`Signal: ${result.signal} — ${result.reason}`, result.signal === 'BUY' ? 'buy' : 'sell');

      const canTrade = paperMode
        ? (result.signal === 'BUY' ? paperPositions.length < maxOpenTrades : paperPositions.length > 0)
        : true;

      if (canTrade) {
        if (paperMode) executePaperTrade(result.signal, currentPrice);
        else await executeRealTrade(result.signal, currentPrice);
      } else {
        addLog(`Signal ignoriert (${result.signal === 'BUY' ? 'max. Positionen erreicht' : 'keine offenen Positionen'})`, 'info');
      }
    }

    if (!paperMode && apiKey) await fetchAccountData();
  }, [fetchMarketData, getStrategy, stopLossPct, takeProfitPct, paperMode, apiKey, paperPositions.length, maxOpenTrades, addLog, executePaperTrade, executeRealTrade, fetchAccountData]);

  const startBot = useCallback(async () => {
    setRunning(true);
    addLog(`Bot gestartet — Instrument: ${instrument}, Strategie: ${getStrategy().name}, Modus: ${paperMode ? 'PAPER' : 'LIVE'}`, 'info');
    await runBotCycle();
    intervalRef.current = setInterval(runBotCycle, 60_000);
  }, [addLog, instrument, getStrategy, paperMode, runBotCycle]);

  const stopBot = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    addLog('Bot gestoppt.', 'warn');
  }, [addLog]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  // Initial fetch on mount
  useEffect(() => {
    fetchMarketData();
  }, [instrument, candleUnit, candlePeriod]);

  const chartData = buildChartData(candles);
  const [baseCurrency] = instrument.split('_');
  const currentPrice = ticker ? parseFloat(ticker.last_price || ticker.close) : null;

  const unrealizedPnL = paperPositions.reduce((sum, pos) => {
    return sum + (currentPrice ? (currentPrice - pos.price) * pos.amount : 0);
  }, 0);

  const totalPnL = paperPnL + unrealizedPnL;

  const logColor = { buy: COLORS.green, sell: COLORS.red, warn: COLORS.yellow, error: COLORS.red, info: COLORS.muted };

  // Determine param fields per strategy
  const paramFields = {
    sma_crossover: [
      { key: 'shortPeriod', label: 'Kurze Periode', min: 2, max: 50 },
      { key: 'longPeriod', label: 'Lange Periode', min: 5, max: 200 },
    ],
    rsi: [
      { key: 'period', label: 'RSI Periode', min: 2, max: 50 },
      { key: 'oversold', label: 'Überverkauft (<)', min: 1, max: 49 },
      { key: 'overbought', label: 'Überkauft (>)', min: 51, max: 99 },
    ],
    macd: [
      { key: 'fast', label: 'Schnelle EMA', min: 2, max: 50 },
      { key: 'slow', label: 'Langsame EMA', min: 5, max: 100 },
      { key: 'signal', label: 'Signal Periode', min: 2, max: 30 },
    ],
  };

  const Section = ({ id, title, icon, children }) => (
    <div style={{ marginBottom: '0.5rem' }}>
      <button
        onClick={() => setActiveSection(prev => prev === id ? null : id)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: activeSection === id ? `${COLORS.green}11` : 'rgba(0,0,0,0.2)', border: `1px solid ${activeSection === id ? COLORS.border : 'transparent'}`, borderRadius: 8, color: activeSection === id ? COLORS.green : COLORS.muted, fontFamily: 'monospace', fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{icon}{title}</span>
        {activeSection === id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {activeSection === id && <div style={{ padding: '12px 4px 4px' }}>{children}</div>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, color: COLORS.text, fontFamily: 'Bitter, serif', padding: '1.5rem', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Space Mono, monospace', fontSize: '1.8rem', background: 'linear-gradient(135deg, #ff6b35, #4ecdc4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            Bitpanda Trading Bot
          </h1>
          <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>
            {instrument} • {getStrategy().name} • {paperMode ? '📄 Paper Trading' : '⚡ Live Trading'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {currentPrice && (
            <div style={{ textAlign: 'right' }}>
              <Label>Aktueller Preis</Label>
              <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, color: COLORS.green }}>€{fmt(currentPrice, 2)}</div>
            </div>
          )}
          {lastSignal && <SignalBadge signal={lastSignal.signal} />}
          {running ? (
            <Btn variant="danger" size="lg" onClick={stopBot}><Square size={16} />Stopp</Btn>
          ) : (
            <Btn variant="primary" size="lg" onClick={startBot}><Play size={16} />Starten</Btn>
          )}
          <Btn variant="ghost" size="md" onClick={() => { fetchMarketData(); if (!paperMode && apiKey) fetchAccountData(); }}><RefreshCw size={14} />Aktualisieren</Btn>
        </div>
      </div>

      {/* Alert: real trading */}
      {!paperMode && (
        <div style={{ background: `${COLORS.orange}22`, border: `1px solid ${COLORS.orange}`, borderRadius: 8, padding: '10px 16px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: COLORS.orange }}>
          <AlertTriangle size={16} />
          <strong>Achtung — LIVE-MODUS:</strong>&nbsp;Echte Orders werden platziert. Nur mit verifizierten API-Schlüsseln und auf eigenes Risiko verwenden!
        </div>
      )}

      {error && (
        <div style={{ background: `${COLORS.red}22`, border: `1px solid ${COLORS.red}`, borderRadius: 8, padding: '8px 14px', marginBottom: '1rem', fontSize: 12, color: COLORS.red, display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertTriangle size={14} />{error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left sidebar */}
        <div>
          {/* Status cards */}
          {paperMode && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <Panel style={{ padding: '1rem' }}>
                <Label>Gesamt P&L</Label>
                <Value color={totalPnL >= 0 ? COLORS.green : COLORS.red}>{totalPnL >= 0 ? '+' : ''}€{fmt(totalPnL)}</Value>
              </Panel>
              <Panel style={{ padding: '1rem' }}>
                <Label>Offene Positionen</Label>
                <Value>{paperPositions.length}</Value>
              </Panel>
            </div>
          )}

          {/* Config accordion */}
          <Panel title="Konfiguration" icon={<Settings size={14} />}>
            <Section id="api" title="API Schlüssel" icon={<Key size={12} />}>
              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                <Label>Bitpanda Pro API Key</Label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="Dein API Schlüssel..."
                    style={{ flex: 1, padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, fontFamily: 'monospace', fontSize: 12, outline: 'none' }}
                  />
                  <button onClick={() => setShowKey(v => !v)} style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: COLORS.muted }}>
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 4 }}>
                  Erstellen unter: bitpanda.com → API Keys
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12 }}>
                  <input type="checkbox" checked={paperMode} onChange={e => setPaperMode(e.target.checked)} />
                  <span style={{ color: paperMode ? COLORS.yellow : COLORS.red, fontWeight: 700 }}>
                    {paperMode ? '📄 Paper Trading (sicher)' : '⚡ Live Trading (echtes Geld!)'}
                  </span>
                </label>
              </div>
            </Section>

            <Section id="market" title="Markt" icon={<BarChart2 size={12} />}>
              <Select label="Handelspaar" value={instrument} onChange={setInstrument} options={INSTRUMENTS} />
              <Select label="Kerzen-Einheit" value={candleUnit} onChange={v => { setCandleUnit(v); setCandlePeriod(CANDLE_PERIODS[v][0]); }} options={CANDLE_UNITS} />
              <Select label="Kerzen-Periode" value={candlePeriod} onChange={v => setCandlePeriod(Number(v))}
                options={CANDLE_PERIODS[candleUnit].map(p => ({ value: p, label: `${p} ${candleUnit.toLowerCase()}` }))} />
            </Section>

            <Section id="strategy" title="Strategie" icon={<TrendingUp size={12} />}>
              <Select label="Strategie" value={strategyId} onChange={setStrategyId}
                options={[
                  { value: 'sma_crossover', label: 'SMA Crossover' },
                  { value: 'rsi', label: 'RSI' },
                  { value: 'macd', label: 'MACD' },
                ]}
              />
              {(paramFields[strategyId] || []).map(f => (
                <Input key={f.key} label={f.label} type="number" value={strategyParams[f.key] ?? 0}
                  onChange={v => setStrategyParams(prev => ({ ...prev, [f.key]: v }))} min={f.min} max={f.max} step={1} />
              ))}
            </Section>

            <Section id="risk" title="Risiko & Position" icon={<DollarSign size={12} />}>
              <Input label={`Handelsbetrag (${baseCurrency})`} type="number" value={tradeAmount}
                onChange={setTradeAmount} step={0.0001} min={0.0001} />
              <Input label="Max. offene Positionen" type="number" value={maxOpenTrades}
                onChange={setMaxOpenTrades} min={1} max={20} step={1} />
              <Input label="Stop-Loss (%)" type="number" value={stopLossPct}
                onChange={setStopLossPct} min={0.1} max={50} step={0.1} />
              <Input label="Take-Profit (%)" type="number" value={takeProfitPct}
                onChange={setTakeProfitPct} min={0.1} max={100} step={0.1} />
            </Section>
          </Panel>

          {/* Last signal */}
          {lastSignal && (
            <Panel title="Letztes Signal" icon={lastSignal.signal === 'BUY' ? <TrendingUp size={14} /> : lastSignal.signal === 'SELL' ? <TrendingDown size={14} /> : <Minus size={14} />} style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: 8 }}><SignalBadge signal={lastSignal.signal} /></div>
              <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>{lastSignal.reason}</div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 6 }}><Clock size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} />{fmtTime(lastSignal.time)}</div>
            </Panel>
          )}

          {/* Paper positions */}
          {paperMode && paperPositions.length > 0 && (
            <Panel title={`Offene Positionen (${paperPositions.length})`} icon={<List size={14} />} style={{ marginTop: '1rem' }}>
              {paperPositions.map(pos => {
                const change = currentPrice ? ((currentPrice - pos.price) / pos.price) * 100 : 0;
                const pnl = currentPrice ? (currentPrice - pos.price) * pos.amount : 0;
                return (
                  <div key={pos.id} style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: 6, marginBottom: 6, borderLeft: `3px solid ${pnl >= 0 ? COLORS.green : COLORS.red}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: COLORS.muted }}>{pos.amount} {baseCurrency}</span>
                      <span style={{ color: pnl >= 0 ? COLORS.green : COLORS.red, fontWeight: 700 }}>
                        {pnl >= 0 ? '+' : ''}€{fmt(pnl)} ({change >= 0 ? '+' : ''}{fmt(change)}%)
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>
                      Einstieg: €{fmt(pos.price)} • {fmtTime(pos.time)}
                    </div>
                  </div>
                );
              })}
            </Panel>
          )}
        </div>

        {/* Main content */}
        <div>
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {[
              { id: 'chart', label: 'Chart', icon: <BarChart2 size={14} /> },
              { id: 'trades', label: 'Trades', icon: <List size={14} /> },
              { id: 'log', label: 'Log', icon: <Clock size={14} /> },
              ...(apiKey ? [{ id: 'account', label: 'Konto', icon: <DollarSign size={14} /> }] : []),
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: `1px solid ${tab === t.id ? COLORS.green : COLORS.border}`, background: tab === t.id ? `${COLORS.green}22` : 'transparent', color: tab === t.id ? COLORS.green : COLORS.muted, fontFamily: 'monospace', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {/* Chart tab */}
          {tab === 'chart' && (
            <Panel>
              {chartData.length === 0 ? (
                <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.muted }}>
                  <RefreshCw size={20} style={{ marginRight: 8 }} />Lade Marktdaten...
                </div>
              ) : (
                <>
                  {/* Price chart */}
                  <div style={{ marginBottom: '0.5rem', fontSize: 12, color: COLORS.muted, fontFamily: 'monospace' }}>
                    Preis + {strategyId === 'sma_crossover' ? 'SMA Indikatoren' : strategyId === 'rsi' ? 'RSI Indikator' : 'MACD Indikator'}
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="time" stroke={COLORS.muted} tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                      <YAxis stroke={COLORS.muted} tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="price" stroke={COLORS.green} dot={false} strokeWidth={2} name="Preis (€)" />
                      {strategyId === 'sma_crossover' && <>
                        <Line type="monotone" dataKey="shortSMA" stroke={COLORS.orange} dot={false} strokeWidth={1.5} name={`SMA ${strategyParams.shortPeriod}`} />
                        <Line type="monotone" dataKey="longSMA" stroke={COLORS.purple} dot={false} strokeWidth={1.5} name={`SMA ${strategyParams.longPeriod}`} />
                      </>}
                    </LineChart>
                  </ResponsiveContainer>

                  {/* RSI sub-chart */}
                  {strategyId === 'rsi' && (
                    <>
                      <div style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: 12, color: COLORS.muted, fontFamily: 'monospace' }}>RSI ({strategyParams.period})</div>
                      <ResponsiveContainer width="100%" height={120}>
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="time" stroke={COLORS.muted} tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                          <YAxis domain={[0, 100]} stroke={COLORS.muted} tick={{ fontSize: 10 }} />
                          <Tooltip contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} />
                          <ReferenceLine y={strategyParams.overbought || 70} stroke={COLORS.red} strokeDasharray="4 4" />
                          <ReferenceLine y={strategyParams.oversold || 30} stroke={COLORS.green} strokeDasharray="4 4" />
                          <ReferenceLine y={50} stroke={COLORS.muted} strokeDasharray="2 2" />
                          <Line type="monotone" dataKey="rsi" stroke={COLORS.yellow} dot={false} strokeWidth={2} name="RSI" />
                        </LineChart>
                      </ResponsiveContainer>
                    </>
                  )}

                  {/* MACD sub-chart */}
                  {strategyId === 'macd' && (
                    <>
                      <div style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: 12, color: COLORS.muted, fontFamily: 'monospace' }}>MACD ({strategyParams.fast}/{strategyParams.slow}/{strategyParams.signal})</div>
                      <ResponsiveContainer width="100%" height={120}>
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="time" stroke={COLORS.muted} tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                          <YAxis stroke={COLORS.muted} tick={{ fontSize: 10 }} />
                          <Tooltip contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} />
                          <ReferenceLine y={0} stroke={COLORS.muted} />
                          <Line type="monotone" dataKey="macdLine" stroke={COLORS.green} dot={false} strokeWidth={1.5} name="MACD" />
                          <Line type="monotone" dataKey="signalLine" stroke={COLORS.orange} dot={false} strokeWidth={1.5} name="Signal" />
                        </LineChart>
                      </ResponsiveContainer>
                    </>
                  )}
                </>
              )}
            </Panel>
          )}

          {/* Trades tab */}
          {tab === 'trades' && (
            <Panel title="Trade-Historie" icon={<List size={14} />}>
              {tradeHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: COLORS.muted, fontSize: 13 }}>
                  Noch keine Trades. Starte den Bot, um Trades zu sehen.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'monospace' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        {['Zeit', 'Typ', 'Preis', 'Menge', 'P&L'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: COLORS.muted, fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tradeHistory.map(t => (
                        <tr key={t.id} style={{ borderBottom: `1px solid ${COLORS.border}22` }}>
                          <td style={{ padding: '8px 12px', color: COLORS.muted }}>{fmtTime(t.closeTime || t.time)}</td>
                          <td style={{ padding: '8px 12px' }}>
                            <span style={{ color: t.type === 'open' ? COLORS.green : COLORS.red, fontWeight: 700 }}>
                              {t.type === 'open' ? '▲ KAUF' : '▼ VERKAUF'}
                            </span>
                          </td>
                          <td style={{ padding: '8px 12px' }}>€{fmt(t.type === 'close' ? t.closePrice : t.price)}</td>
                          <td style={{ padding: '8px 12px' }}>{t.amount} {baseCurrency}</td>
                          <td style={{ padding: '8px 12px', color: t.pnl != null ? (t.pnl >= 0 ? COLORS.green : COLORS.red) : COLORS.muted }}>
                            {t.pnl != null ? `${t.pnl >= 0 ? '+' : ''}€${fmt(t.pnl)}` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          )}

          {/* Log tab */}
          {tab === 'log' && (
            <Panel title="Bot-Log" icon={<Clock size={14} />}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
                <Btn variant="ghost" size="sm" onClick={() => setLogs([])}><RefreshCw size={12} />Leeren</Btn>
              </div>
              <div style={{ maxHeight: 480, overflowY: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
                {logs.length === 0 ? (
                  <div style={{ color: COLORS.muted, textAlign: 'center', padding: '2rem' }}>Noch keine Log-Einträge.</div>
                ) : logs.map(l => (
                  <div key={l.id} style={{ display: 'flex', gap: 12, padding: '5px 0', borderBottom: `1px solid ${COLORS.border}22` }}>
                    <span style={{ color: COLORS.muted, whiteSpace: 'nowrap', minWidth: 60 }}>{l.time}</span>
                    <span style={{ color: logColor[l.type] || COLORS.text }}>{l.msg}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* Account tab */}
          {tab === 'account' && (
            <Panel title="Kontoübersicht" icon={<DollarSign size={14} />}>
              <Btn variant="ghost" size="sm" onClick={fetchAccountData} style={{ marginBottom: '1rem' }}><RefreshCw size={12} />Aktualisieren</Btn>
              {balances ? (
                <div>
                  <div style={{ marginBottom: '1rem', fontSize: 12, color: COLORS.muted }}>Verfügbare Guthaben (nicht-null)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                    {balances.filter(b => parseFloat(b.available) > 0).map(b => (
                      <div key={b.account_id} style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
                        <Label>{b.currency_code}</Label>
                        <Value style={{ fontSize: 14 }}>{fmt(parseFloat(b.available), 6)}</Value>
                        {b.locked && parseFloat(b.locked) > 0 && (
                          <div style={{ fontSize: 10, color: COLORS.orange, marginTop: 2 }}>Gesperrt: {fmt(parseFloat(b.locked), 6)}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {openOrders.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: '0.75rem' }}>Offene Orders</div>
                      {openOrders.map(o => (
                        <div key={o.order_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 6, marginBottom: 6, fontSize: 12, fontFamily: 'monospace' }}>
                          <span style={{ color: o.side === 'BUY' ? COLORS.green : COLORS.red }}>{o.side}</span>
                          <span>{o.amount} @ €{fmt(o.price)}</span>
                          <Btn variant="ghost" size="sm" onClick={async () => { await apiRef.current.cancelOrder(o.order_id); fetchAccountData(); }}>
                            Stornieren
                          </Btn>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ color: COLORS.muted, fontSize: 13 }}>
                  {apiKey ? 'Klicke "Aktualisieren" um Kontodaten zu laden.' : 'Kein API-Schlüssel eingegeben.'}
                </div>
              )}
            </Panel>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div style={{ marginTop: '2rem', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 11, color: COLORS.muted, textAlign: 'center' }}>
        ⚠️ Dieser Bot dient ausschließlich zu Bildungszwecken. Trading beinhaltet erhebliche Risiken. Verwende den Live-Modus nur auf eigenes Risiko und teste immer zuerst im Paper-Trading-Modus.
        Browser-basierte CORS-Anfragen zur Bitpanda Exchange API können für authentifizierte Endpunkte einen Backend-Proxy erfordern.
      </div>
    </div>
  );
}
