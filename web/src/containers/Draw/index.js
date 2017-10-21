import { connect } from 'react-redux';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

const COLOR_DRAW = 'rgb(0, 0, 0)';
const LINE_WIDTH = 2;

export class Draw extends Component {
    constructor(props) {
        super(props);

        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;

        this.drawing = false;

        this.state = {
            lines: []
        };
    }
    onDrawStart({ posX, posY }) {
        this.drawing = true;

        this.setState({
            lines: [[[posX, posY]], ...this.state.lines]
        });
    }
    onDraw({ posX, posY }) {
        if (!this.drawing) {
            return;
        }

        this.setState({
            lines: [
                [
                    ...this.state.lines[0],
                    [posX, posY]
                ],
                ...this.state.lines.slice(1)
            ]
        });
    }
    onDrawEnd({ posX, posY }) {
        this.onDraw({ posX, posY });

        this.drawing = false;
    }
    draw() {
        // draw the current line on the canvas
        if (!this.ctx) {
            return;
        }

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.beginPath();

        this.state.lines.forEach(line => {
            line.forEach((point, key) => {
                if (key > 0) {
                    this.ctx.lineTo(point[0], point[1]);
                }
                else {
                    this.ctx.moveTo(point[0], point[1]);
                }
            });
        });

        this.ctx.strokeStyle = COLOR_DRAW;
        this.ctx.lineWidth = LINE_WIDTH;
        this.ctx.stroke();
        this.ctx.closePath();
    }
    clear() {
        this.setState({ lines: [] });
    }
    componentDidMount() {
        this.draw();
    }
    componentDidUpdate() {
        this.draw();
    }
    getPosXY(evt) {
        if (!this.canvas) {
            return null;
        }

        return {
            posX: evt.clientX - this.canvas.offsetLeft,
            posY: evt.clientY - this.canvas.offsetTop
        };
    }
    render() {
        const canvasRef = canvas => {
            if (!(canvas && canvas.parentNode)) {
                return;
            }

            this.canvas = canvas;

            this.canvas.width = canvas.parentNode.offsetWidth - 2;
            this.canvas.height = canvas.parentNode.offsetHeight - 2;

            this.width = this.canvas.width;
            this.height = this.canvas.height;

            this.ctx = canvas.getContext('2d');
        };

        const onMouseDown = evt => this.onDrawStart(this.getPosXY(evt));
        const onMouseUp = evt => this.onDrawEnd(this.getPosXY(evt));
        const onMouseMove = evt => this.onDraw(this.getPosXY(evt));
        const onMouseOut = onMouseUp;
        const onTouchStart = onMouseDown;
        const onTouchMove = onMouseMove;
        const onTouchEnd = onMouseUp;

        const onClear = () => this.clear();

        return <div className="draw-outer">
            <div className="draw-canvas-outer">
                <canvas
                    className="draw-canvas"
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseOut={onMouseOut}
                    onMouseMove={onMouseMove}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                />
            </div>
            <div className="controls">
                <button className="button button-clear" onClick={onClear}>Clear</button>
            </div>
        </div>;
    }
}

Draw.propTypes = {
};

const mapStateToProps = null;
const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(Draw);

