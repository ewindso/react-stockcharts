"use strict";

import React from "react";
import objectAssign from "object-assign";

import pure from "../pure";

function getDisplayName(Series) {
	var name = Series.displayName || Series.name || "Series";
	return name;
}

function wrap(WrappedSeries) {
	class BaseCanvasSeries extends React.Component {
		componentDidMount() {
			var callback = WrappedSeries.drawOnCanvas;
			if (callback) {
				var { chartCanvasType } = this.context;
				var { getCanvasContexts } = this.props;

				if (chartCanvasType !== "svg" && getCanvasContexts !== undefined) {
					var contexts = getCanvasContexts();
					var { defaultProps } = WrappedSeries;
					var props = objectAssign({}, defaultProps, this.props);
					if (contexts) BaseCanvasSeries.baseReStockDrawOnCanvasHelper(contexts.axes, props, callback);
				}
			}
		}
		componentDidUpdate() {
			this.componentDidMount();
		}
		componentWillMount() {
			this.componentWillReceiveProps(this.props);
		}
		componentWillReceiveProps(nextProps) {
			var callback = WrappedSeries.drawOnCanvas;
			if (callback) {
				var { canvasOriginX, canvasOriginY , height, width, compareSeries,
					indicator, xAccessor, yAccessor, seriesId, chartId } = nextProps;
				var canvasOrigin = [canvasOriginX, canvasOriginY];

				var { defaultProps } = WrappedSeries;
				var props = objectAssign({}, defaultProps, nextProps);

				var draw = BaseCanvasSeries.baseReStockDrawOnCanvas.bind(null, props, callback, canvasOrigin, height, width, compareSeries, indicator, xAccessor, yAccessor);

				nextProps.callbackForCanvasDraw({
					chartId: chartId,
					seriesId: seriesId,
					draw: draw,
				});
			}
		}
		render() {
			var callback = WrappedSeries.drawOnCanvas;
			var { chartCanvasType } = this.props;

			if (chartCanvasType !== "svg" && callback !== undefined) return null;

			return <WrappedSeries ref="wrappedSeries"
				{...this.props} />;
		}
	};

		/*
			var { type, height, width, compareSeries, indicator, xAccessor,
				yAccessor, xScale, yScale, plotData, stroke, fill } = this.props;
			// var { defaultProps } = WrappedSeries;

			// console.log(this.props);

				{...defaultProps}
				type={type}
				height={height} width={width}
				compareSeries={compareSeries}
				indicator={indicator}
				xAccessor={xAccessor} yAccessor={yAccessor}
				xScale={xScale} yScale={yScale}
				stroke={stroke} fill={fill}
				plotData={plotData}
		*/

	BaseCanvasSeries.displayName = `wrap(${ getDisplayName(WrappedSeries) })`;

	BaseCanvasSeries.baseReStockDrawOnCanvasHelper = (canvasContext, props, callback) => {
		var { height, width, compareSeries, indicator, xAccessor, yAccessor,
			xScale, yScale, plotData, canvasOriginX, canvasOriginY } = props;
		var canvasOrigin = [canvasOriginX, canvasOriginY];

		BaseCanvasSeries.baseReStockDrawOnCanvas(props, callback, canvasOrigin, height, width,
			compareSeries, indicator, xAccessor, yAccessor, canvasContext, xScale, yScale, plotData);
	};

	BaseCanvasSeries.baseReStockDrawOnCanvas = (props, callback,
			canvasOrigin, height, width, compareSeries, indicator,
			xAccessor, yAccessor, ctx, xScale, yScale, plotData) => {

		ctx.save();

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(canvasOrigin[0], canvasOrigin[1]);

		ctx.beginPath();
		ctx.rect(-1, -1, width + 1, height + 1);
		ctx.clip();

		// console.log("HERE");
		if (callback) {
			var newProps = objectAssign({}, { height, width, compareSeries, indicator, xAccessor, yAccessor }, props);
			callback(newProps, ctx, xScale, yScale, plotData);
		}

		ctx.restore();
	};

	/* Object.keys(WrappedSeries)
		.filter((key) => key !== "propTypes")
		.filter(key => key !== "defaultProps")
		.filter(key => key !== "displayName")
		.filter(key => key !== "contextTypes")
		.filter(key => key !== "childContextTypes")
		.forEach(key => BaseCanvasSeries[key] = WrappedSeries[key]);*/

	BaseCanvasSeries.yAccessor = WrappedSeries.yAccessor;
	BaseCanvasSeries.defaultProps = WrappedSeries.defaultProps;
	// console.log(Object.keys(BaseCanvasSeries))
	return pure(BaseCanvasSeries, {
		getCanvasContexts: React.PropTypes.func,
		canvasOriginX: React.PropTypes.number,
		canvasOriginY: React.PropTypes.number,
		height: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
		callbackForCanvasDraw: React.PropTypes.func.isRequired,
		chartId: React.PropTypes.number.isRequired,
		seriesId: React.PropTypes.number.isRequired,
		stroke: React.PropTypes.string,
		fill: React.PropTypes.string,

		chartCanvasType: React.PropTypes.string,
		indicator: React.PropTypes.func,
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		xAccessor: React.PropTypes.func.isRequired,
		yAccessor: React.PropTypes.func.isRequired,
		compareSeries: React.PropTypes.array.isRequired,
		plotData: React.PropTypes.array.isRequired,
	});
}

export default wrap;
