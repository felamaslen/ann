class Unit {
    constructor(value, grad) {
        this.value = value;
        this.grad = grad;
    }
}

class Gate {
    constructor() {
        this.utop = null;
        this.inputs = null;
    }
    forward(...inputs) {
        this.inputs = inputs;

        this.utop = new Unit(this.forwardMethod(...inputs.map(input => input.value)), 0.0);

        return this.utop;
    }
}

class MultiplyGate extends Gate {
    forwardMethod(v0, v1) {
        return v0 * v1;
    }
    backward() {
        this.inputs[0].grad += this.inputs[1].value * this.utop.grad;
        this.inputs[1].grad += this.inputs[0].value * this.utop.grad;
    }
}

class AddGate extends Gate {
    forwardMethod(v0, v1) {
        return v0 + v1;
    }
    backward() {
        this.inputs[0].grad += this.utop.grad;
        this.inputs[1].grad += this.utop.grad;
    }
}

const sigmoid = value => 1 / (1 + Math.pow(Math.E, -value));

class SigmoidGate extends Gate {
    forwardMethod(v0) {
        return sigmoid(v0);
    }
    backward() {
        const sig = sigmoid(this.inputs[0].value);

        this.inputs[0].grad += sig * (1 - sig) * this.utop.grad;
    }
}

// create input units
const a = new Unit(1.0, 0.0);
const b = new Unit(2.0, 0.0);
const c = new Unit(-3.0, 0.0);
const x = new Unit(-1.0, 0.0);
const y = new Unit(3.0, 0.0);

// create the gates
const mulg0 = new MultiplyGate();
const mulg1 = new MultiplyGate();
const addg0 = new AddGate();
const addg1 = new AddGate();
const sg0 = new SigmoidGate();

// do the forward pass
const forwardNeuron = () => {
    const ax = mulg0.forward(a, x); // a*x = -1
    const by = mulg1.forward(b, y); // b*y = 6
    const axpby = addg0.forward(ax, by); // a*x + b*y = 5
    const axpbypc = addg1.forward(axpby, c); // a*x + b*y + c = 2
    const s = sg0.forward(axpbypc); // sig(a*x + b*y + c) = 0.8808

    console.log(s.value);

    s.grad = 1.0;
    sg0.backward(); // writes gradient into axpbypc
    addg1.backward(); // writes gradients into axpby and c
    addg0.backward(); // writes gradients into ax and by
    mulg1.backward(); // writes gradients into b and y
    mulg0.backward(); // writes gradients into a and x
};

function init() {
    forwardNeuron();
}

init();

