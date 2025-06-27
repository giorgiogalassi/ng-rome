#!/bin/bash
# Script to install dependencies and add Angular Material

# Ensure execution stops on error
set -e

echo "Current directory: $(pwd)"
echo "Listing files before npm install:"
ls -la

# Install npm dependencies
npm install

echo "Listing files after npm install (checking for node_modules):"
ls -la

# Add Angular Material
node_modules/.bin/ng add @angular/material --skip-confirmation --verbose

echo "Angular Material added successfully."
