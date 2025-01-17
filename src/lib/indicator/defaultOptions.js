export const BollingerBand = {
	period: 20,
	source: "close",
	multiplier: 2,
	movingAverageType: "sma"
};

export const MACD = {
	fast: 12,
	slow: 26,
	signal: 9,
	source: "close",
	fill: {
		histogram: 'steelblue'
	},
	stroke: {
		MACDLine: 'red',
		signalLine: 'green',
		histogram: 'steelblue'
	}
};

export const FullStochasticOscillator = {
	period: 12,
	K: 3,
	D: 3,
	ohlc: (d) => ({open: d.open, high: d.high, low: d.low, close: d.close}),
	stroke: {
		D: 'green',
		K: 'red',
	},
	overSold: 80,
	overBought: 20,
};

export const RSI = {
	period: 14,
	source: "close",
	overSold: 70,
	overBought: 30,
};

export const EMA = {
	source: "close",
	period: 10,
};

export const SMA = {
	source: "close",
	period: 10,
};
