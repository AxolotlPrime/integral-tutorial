import React, { useState } from 'react';
import IntegralTutorial from './App_Tutorial';
import TradingBot from './TradingBot';

const NAV_ITEMS = [
  { id: 'tutorial', label: '∫ Integral Tutorial' },
  { id: 'bot', label: '⚡ Trading Bot' },
];

export default function App() {
  const [page, setPage] = useState('tutorial');

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a' }}>
      <nav style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(78,205,196,0.15)', position: 'sticky', top: 0, zIndex: 200 }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              padding: '6px 18px',
              borderRadius: 8,
              border: `1px solid ${page === item.id ? '#4ecdc4' : 'rgba(255,255,255,0.1)'}`,
              background: page === item.id ? 'rgba(78,205,196,0.15)' : 'transparent',
              color: page === item.id ? '#4ecdc4' : 'rgba(255,255,255,0.5)',
              fontFamily: 'Space Mono, monospace',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {page === 'tutorial' ? <IntegralTutorial /> : <TradingBot />}
    </div>
  );
}
