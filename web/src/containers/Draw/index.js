import { connect } from 'react-redux';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Draw extends Component {
    constructor(props) {
        super(props);

        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;
    }
    render() {
        const canvasRef = canvas => {
            this.canvas = canvas;

            this.canvas.width = canvas.parentNode.innerWidth;
            this.canvas.height = canvas.parentNode.innerHeight;

            this.width = this.canvas.width;
            this.height = this.canvas.height;

            this.ctx = canvas.getContext('2d');
        };

        return <div className="draw-outer">
            <canvas className="draw-canvas" ref={canvasRef} />
        </div>;
    }
}

Draw.propTypes = {
};

const mapStateToProps = null;
const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(Draw);

