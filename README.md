# Automate-VSU-TPES

This project automates the Visayas State University (VSU) TPES (Teacher Performance Evaluation System) process through the VSU Student Portal, using Puppeteer. It simplifies the repetitive actions students perform on the portal by automating them, enhancing efficiency and saving time.

# Web Preview
https://automate-vsu-tpes.vercel.app

You can directly use the raw script if you prefer a non web one.

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## About the Project

The purpose of this project is to automate the TPES process for students at VSU, allowing them to efficiently complete required actions on the portal without manually navigating and performing repetitive steps.

## Features

- Automated login to the VSU Student Portal
- Automated completion of tasks related to TPES
- User-friendly configuration through environment variables
- Logging for monitoring automated actions

## Getting Started

### Prerequisites

Ensure you have the following installed before running the project:

- **Node.js** (version 18 or higher)
- **npm** (Node Package Manager)
- **Google Chrome** or a Chromium-based browser (for Puppeteer to control)

To verify installations, run:

```bash
node -v
npm -v
```

### Installation

Clone this repository and install the dependencies.

```bash
# Clone the repository
git clone https://github.com/VincePradas/Automate-VSU-TPES.git

# Navigate into the project directory
cd Automate-VSU-TPES

# Install dependencies
npm install
```

## Usage

To start the automation process, follow these steps:

1. Set up environment variables in a `.env` file (explained below).
2. Run the script using the command below:

   ```bash
   npm start
   ```

### Environment Variables

Create a `.env` file in the root directory of the project to store your VSU portal credentials securely. The file should include the following variables:

```env
VSU_CUMULUS_USERNAME="your-username"
VSU_CUMULUS_PASSWORD="your-password"
```
or you can directly write your credentials if you're not planning to deploying it.

> **Note:** But for security reasons, avoid hardcoding sensitive information in your code. Use environment variables instead.

### Example Command

```bash
# Run the automation script
node script-raw.js
```

## Using the Raw Script

If you prefer using the raw script directly without the web interface, follow these steps:

1. Download only the required files:
   - `script-raw.js`
   - `package.json`

2. Install only the necessary dependencies:
```bash
npm install puppeteer dotenv
```

3. Configure your credentials using either method:

   **Direct modification (For local use only)**
   Open `script-raw.js` and modify these lines:
   ```javascript
   const username = 'your-username';
   const password = 'your-password';
   ```

4. Run the script:
```bash
node script-raw.js
```

### Troubleshooting Raw Script

- If you get a Chrome/Chromium error, ensure you have a compatible browser installed
- For "Module not found" errors, verify you've installed the dependencies
- Check your credentials if you get login failures

## Contributing

Contributions are welcome! Follow these steps to get started:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a pull request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

---
