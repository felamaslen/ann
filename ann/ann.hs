-- module Main (main) where

import Numeric.LinearAlgebra.HMatrix

-- import Configuration.Dotenv
-- loadFile False "./.env"

outputMap = ['0'..'9'] ++ ['a'..'z'] ++ ['A'..'Z']

sigmoid :: IO (Matrix Double) -> IO (Matrix Double)
sigmoid z = 1.0 / (1.0 + exp(-z))

genBiases :: [Int] -> [IO (Matrix Double)]
genBiases layers = [randn y 1 | y <- tail layers]

genWeights :: [Int] -> [IO (Matrix Double)]
genWeights layers = [randn y x | (x, y) <- zip (init layers) (tail layers)]

--feedForwardIter :: IO (Matrix Double) -> IO (Matrix Double) -> IO (Vector Double) -> IO (Vector Double)
--feedForwardIter b w a = sigmoid ((w <.> a) + b)
--
--feedForward :: [IO (Matrix Double)] -> [IO (Matrix Double)] -> IO (Vector Double) -> IO (Vector Double)
--feedForward [b] [w] input = feedForwardIter b w input
--feedForward (b:biases) (w:weights) input = feedForward biases weights (feedForwardIter b w input)

-- main :: IO ()
-- main = do
-- 

