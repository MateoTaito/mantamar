#!/bin/bash
# Wrapper para Stryker que acepta rutas con corchetes.
node tools/mutate.js "$1"
