import { connect } from 'react-redux';

import { drawingSent } from '../../actions/app.actions';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

const COLOR_DRAW = 'rgb(0, 0, 0)';
const COLOR_INACTIVE = 'rgb(100, 100, 100)';
const LINE_WIDTH = 2;
const WIDTH = 30;
const HEIGHT = 30;

export class Draw extends Component {
    constructor(props) {
        super(props);

        this.canvas = null;
        this.ctx = null;
        this.width = WIDTH;
        this.height = HEIGHT;

        this.widthRatio = 1;
        this.heightRatio = 1;

        this.drawing = false;

        this.state = {
            lines: []
        };
    }
    onDrawStart({ posX, posY }) {
        if (!this.props.active) {
            return;
        }

        this.drawing = true;

        this.setState({
            lines: [[[posX, posY]], ...this.state.lines]
        });
    }
    onDraw({ posX, posY }) {
        if (!this.props.active || !this.drawing) {
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
        if (!this.props.active) {
            return;
        }

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

        if (this.props.active) {
            this.ctx.strokeStyle = COLOR_DRAW;
        }
        else {
            this.ctx.strokeStyle = COLOR_INACTIVE;
        }

        this.ctx.lineWidth = LINE_WIDTH;
        this.ctx.stroke();
        this.ctx.closePath();
    }
    clear() {
        this.setState({ lines: [] });
    }
    send() {
        const drawingUrl = this.canvas.toDataURL();

        this.props.sendDrawing(drawingUrl);
    }
    componentDidMount() {
        this.draw();
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.active && this.props.active) {
            this.setState({
                lines: []
            });
        }

        this.draw();
    }
    getPosXY(evt) {
        if (!this.canvas) {
            return null;
        }

        return {
            posX: this.widthRatio * (evt.clientX - this.canvas.offsetLeft),
            posY: this.heightRatio * (evt.clientY - this.canvas.offsetTop)
        };
    }
    render() {
        const canvasRef = canvas => {
            if (!(canvas && canvas.parentNode)) {
                return;
            }

            this.canvas = canvas;

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.widthRatio = this.width / this.canvas.parentNode.offsetWidth;
            this.heightRatio = this.height / this.canvas.parentNode.offsetHeight;

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
        const onSend = () => this.send();

        const disabled = !this.props.active;

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
                <button className="button button-clear" onClick={onClear}
                    disabled={disabled}>Clear</button>
                <button className="button button-send" onClick={onSend}
                    disabled={disabled}>Send</button>
            </div>
        </div>;
    }
}

Draw.propTypes = {
    active: PropTypes.bool.isRequired,
    sendDrawing: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    active: !(state.get('sending') || state.get('sent'))
});

const mapDispatchToProps = dispatch => ({
    sendDrawing: data => dispatch(drawingSent(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Draw);

