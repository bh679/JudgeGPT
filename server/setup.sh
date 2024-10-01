#!/bin/bash
#ChatGPT thread to make this
#https://chat.openai.com/share/c99155e9-2367-4d36-ae33-404d32957b87
#chmod +x setup.sh


# Check if Node.js and npm are installed
if ! [ -x "$(command -v node)" ]; then
  echo "Node.js is not installed. Installing now..."
  curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "Node.js is already installed."
fi

if ! [ -x "$(command -v npm)" ]; then
  echo "npm is not installed. Installing now..."
  sudo apt-get install -y npm
else
  echo "npm is already installed."
fi

# Ensure required npm packages are installed or up-to-date
npm_packages=("cors" "axios" "express" "node-fetch" "form-data" "multer" "microsoft-cognitiveservices-speech-sdk" "express-range" "openai")

for pkg in "${npm_packages[@]}"; do
    if ! npm list --depth 1 $pkg > /dev/null 2>&1; then
        echo "Installing $pkg..."
        npm install $pkg
    else
        echo "$pkg is already installed."
        
        # Check if the package is outdated
        if npm outdated | grep -q "$pkg"; then
            echo "Updating $pkg..."
            npm update $pkg
        else
            echo "$pkg is up-to-date."
        fi
    fi
done

# Check if PM2 is installed
if ! [ -x "$(command -v pm2)" ]; then
  echo "PM2 is not installed. Installing now..."
  sudo npm install -g pm2
else
  echo "PM2 is already installed."
fi

echo "All dependencies are installed or up-to-date."

chmod +x start.sh

echo "Start the server with ./start.sh"
