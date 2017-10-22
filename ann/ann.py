#!/usr/bin/env python3

# copied and adapted from http://neuralnetworksanddeeplearning.com

import numpy as np

import sys
import base64
from PIL import Image
from io import BytesIO

BIASES_FILE = 'biases.npy'
WEIGHTS_FILE = 'weights.npy'

IMG_WIDTH = 30
IMG_HEIGHT = 30

BRAIN_SIZE = [IMG_WIDTH * IMG_HEIGHT, 10, 26 * 2 + 10]
LEARN_RATE = 10.0

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

def sigmoid_der(z):
    return sigmoid(z) * (1 - sigmoid(z))

def gen_biases(sizes):
    """ Generate random bias values """
    return [np.random.randn(y, 1) for y in sizes[1:]]

def gen_weights(sizes):
    """ Generate random weight values """
    return [np.random.randn(y, x)
            for x, y in zip(sizes[:-1], sizes[1:])]

def feed_forward(biases, weights, a):
    """ Evaluate the neural network """
    for b, w in zip(biases, weights):
        a = sigmoid(np.dot(w, a) + b)

    return a

def cost_derivative(output_activations, expected_value):
    """ vector of partial derivatives \partial C_x / \partial a for the output activations """
    return (output_activations - expected_value)

def backpropagate(biases, weights, input_value, expected_value):
    layered_biases = [np.zeros(b.shape) for b in biases]
    layered_weights = [np.zeros(w.shape) for w in weights]

    activation = input_value
    activations = [input_value]

    zs = []

    # pass the input through the net, capturing each neuron's value and activated value
    for b, w in zip(biases, weights):
        z = np.dot(w, activation) + b
        zs.append(z)

        activation = sigmoid(z)
        activations.append(activation)

    # calculate the cost derivative, based on the error between output and expected value
    delta = cost_derivative(activations[-1], expected_value) * sigmoid_der(zs[-1])

    layered_biases[-1] = delta
    layered_weights[-1] = np.dot(delta, activations[-2].transpose())

    num_layers = len(biases)

    for l in range(2, num_layers):
        z = zs[-l]
        sder = sigmoid_der(z)

        delta = np.dot(weights[-l + 1].transpose(), delta) * sder

        layered_biases[-l] = delta
        layered_weights[-l] = np.dot(delta, activations[-l - 1].transpose())

    return layered_biases, layered_weights


def get_new_weights_biases(biases, weights, input_value, expected_value, learn_rate=LEARN_RATE):
    """ Train the neural network """
    delta_biases, delta_weights = backpropagate(biases, weights, input_value, expected_value)

    new_weights = [w - learn_rate * nw
            for w, nw in zip(weights, delta_weights)]

    new_biases = [b - learn_rate * nb
            for b, nb in zip(biases, delta_biases)]

    return new_biases, new_weights

def get_saved_state():
    try:
        biases = np.load(BIASES_FILE)
        weights = np.load(WEIGHTS_FILE)
    except (IOError, FileNotFoundError):
        biases = gen_biases(BRAIN_SIZE)
        weights = gen_weights(BRAIN_SIZE)

    return biases, weights

def save_state(biases, weights):
    np.save(BIASES_FILE, biases)
    np.save(WEIGHTS_FILE, weights)

def main_result(input_value):
    biases, weights = get_saved_state()

    fed = feed_forward(biases, weights, input_value)

    return np.argmax(fed)

def main_train(input_value, expected_value):
    biases, weights = get_saved_state()

    new_biases, new_weights = get_new_weights_biases(biases, weights, input_value, expected_value)

    save_state(new_biases, new_weights)

def get_np_img(filename):
    fd = open(filename, 'r')
    b64data = fd.read().replace("data:image/png;base64,", "")
    b64decoded = base64.b64decode(b64data)
    img = Image.open(BytesIO(b64decoded))

    npimg = np.array(img)

    bw = np.vectorize(lambda row: row / 255)(npimg)[:, :, [3]].flatten()

    data = np.reshape(bw, (900, 1))

    return data

def main():
    if len(sys.argv) == 1:
        print('Bad invocation - need a filename!')

        return

    filename = sys.argv[1]

    data = get_np_img(filename)

    if len(sys.argv) == 2:
        # run
        result = main_result(data)

        print(result)

    elif len(sys.argv) == 3:
        # train
        print('Training')

        expected_value = int(sys.argv[2])

        main_train(data, expected_value)

    else:
        print('Bad invocation')

main()

