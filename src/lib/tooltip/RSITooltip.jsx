"use strict";

import React from "react";

import Utils from "../utils/utils";
import ChartDataUtil from "../utils/ChartDataUtil";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class RSITooltip extends React.Component {
	render() {
		var { onClick, forChart, forDataSeries, fontSize, fontFamily } = this.props;

		var chartData = ChartDataUtil.getChartDataForChart(this.props, this.context);

		var overlays = chartData.config.overlays
			.filter(eachOverlay => forDataSeries === undefined ? true : forDataSeries === eachOverlay.id)
			.filter(eachOverlay => eachOverlay.indicator !== undefined)
			.filter(eachOverlay => eachOverlay.indicator.isRSI && eachOverlay.indicator.isRSI());

		if (overlays.length > 1 || overlays.length === 0) {
			console.error(`Could not find Exactly one DataSeries with RSI indicator for Chart id=${ forChart }, either use 
				single RSI indicator per chart
				or use forDataSeries property to narrow down to single Series`);
		}

		var overlay = overlays[0];
		var options = overlay.indicator.options();

		var item = ChartDataUtil.getCurrentItemForChart(this.props, this.context);
		var rsi = overlay.yAccessor(item);
		var format = chartData.config.mouseCoordinates.format;

		var value = (rsi !== undefined && format(rsi)) || "n/a";

		var { origin, height, width } = chartData.config;
		var relativeOrigin = typeof this.props.origin === "function"
			? this.props.origin(this.context.width, this.context.height)
			: this.props.origin;
		var absoluteOrigin = [origin[0] + relativeOrigin[0], origin[1] + relativeOrigin[1]];

		return (
			<g transform={`translate(${ absoluteOrigin[0] }, ${ absoluteOrigin[1] })`}
				onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel>
						{`RSI (${ options.period }, ${ options.source }, ${ options.overSold }, ${ options.overBought }): `}
					</ToolTipTSpanLabel>
					<tspan>{value}</tspan>
				</ToolTipText>
			</g>
		);
	}
}

RSITooltip.contextTypes = {
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
};

RSITooltip.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	accessor: React.PropTypes.func.isRequired,
	xDisplayFormat: React.PropTypes.func.isRequired,
	origin: React.PropTypes.oneOfType([
				React.PropTypes.array
				, React.PropTypes.func
			]).isRequired,
	fontFamily: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	forDataSeries: React.PropTypes.number,
	onClick: React.PropTypes.func,
};

RSITooltip.defaultProps = {
	namespace: "ReStock.RSITooltip",
	accessor: (d) => { return {date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume}; },
	xDisplayFormat: Utils.displayDateFormat,
	origin: [0, 0]
};

module.exports = RSITooltip;