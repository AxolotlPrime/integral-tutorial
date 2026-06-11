const API_BASE = 'https://api.exchange.bitpanda.com/public/v1';

export class BitpandaAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  get authHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };
  }

  async request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...(options.auth ? this.authHeaders : { 'Content-Type': 'application/json' }), ...options.headers },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(`API ${res.status}: ${text}`);
    }
    return res.json();
  }

  // Public endpoints (no auth needed)
  async getTicker(instrumentCode) {
    return this.request(`/market-ticker/${instrumentCode}`);
  }

  async getCandlesticks(instrumentCode, { unit = 'MINUTES', period = 5, from, to } = {}) {
    const params = new URLSearchParams({ unit, period });
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    return this.request(`/candlesticks/${instrumentCode}?${params}`);
  }

  async getOrderBook(instrumentCode, { depth = 20 } = {}) {
    return this.request(`/order-book/${instrumentCode}?depth=${depth}`);
  }

  async getInstruments() {
    return this.request('/instruments');
  }

  // Authenticated endpoints
  async getBalances() {
    return this.request('/account/balances', { auth: true });
  }

  async getFees(instrumentCode) {
    return this.request(`/account/fees/${instrumentCode}`, { auth: true });
  }

  async getOrders({ status, instrumentCode } = {}) {
    const params = new URLSearchParams({ with_just_orders_and_trades: true });
    if (status) params.append('order_status', status);
    if (instrumentCode) params.append('instrument_code', instrumentCode);
    return this.request(`/orders?${params}`, { auth: true });
  }

  async createOrder({ instrumentCode, side, type, amount, price, clientId } = {}) {
    const body = {
      instrument_code: instrumentCode,
      side,
      type,
      amount: String(amount),
    };
    if (price) body.price = String(price);
    if (clientId) body.client_id = clientId;
    return this.request('/orders', { method: 'POST', auth: true, body: JSON.stringify(body) });
  }

  async cancelOrder(orderId) {
    return this.request(`/orders/${orderId}`, { method: 'DELETE', auth: true });
  }

  async getTrades({ instrumentCode, from, to } = {}) {
    const params = new URLSearchParams();
    if (instrumentCode) params.append('instrument_code', instrumentCode);
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    return this.request(`/trades?${params}`, { auth: true });
  }
}
