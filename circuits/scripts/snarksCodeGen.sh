#!/bin/bash

for circuit in `find src -name "*.circom" -maxdepth 1`; do
  name=`basename $circuit .circom`
  yarn run snarkjs zkey export verificationkey circuits/ceremony/${name}_0001.zkey circuits/ceremony/${name}verification_key.json
done