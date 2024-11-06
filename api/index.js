const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");

let puppeteer;
let chrome = {};
if (process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.VERCEL) {
  chrome = require("@sparticuz/chromium");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.use(express.json()); // Use JSON for API requests
app.use(express.urlencoded({ extended: true }));

// Array to store logs temporarily
let logMessages = [];

// Helper function to add a log message
function addLog(message) {
  logMessages.push(message);
  console.log(message); // Log to server console for debugging
}

app.get("/", (req, res) => {
  res.send("API RUNNING");
})
// Endpoint to retrieve logs
app.get("/get-logs", (req, res) => {
  res.json({ logs: logMessages });
  logMessages = []; // Clear logs after sending to avoid duplicates
});

// Main endpoint to run the script
app.post("/run-script", async (req, res) => {
  const { username, password, rateVal, subjects } = req.body;

  if (!username || !password || !rateVal) {
    return res.status(400).json({ error: "Username, password, and rating value are required." });
  }

  try {
    addLog("Starting script...");
    await runPuppeteerScript(username, password, rateVal, subjects);
    addLog("Script completed successfully.");
    res.status(200).json({ message: "Script executed successfully." });
  } catch (error) {
    addLog(`Error executing script: ${error.message}`);
    res.status(500).json({ error: "An error occurred while executing the script." });
  }
});

chrome.setHeadlessMode = true;

// Puppeteer script with real-time logging
const runPuppeteerScript = async (username, password, rateVal, subjects) => {
  let options = {};
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.VERCEL) {
    options = {
      args: [...chrome.args, "--disable-dev-shm-usage", "--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  addLog("Executing Script");
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  try {
    await page.goto("https://my.vsu.edu.ph/auth/login", { waitUntil: "networkidle2" });
    await page.type('input[formcontrolname="username"]', username);
    await page.type('input[formcontrolname="password"]', password);
    await clickButton(page, "LOGIN");
    addLog("Login session started, wait...");
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    addLog("LOGGED IN");

    await page.goto("https://my.vsu.edu.ph/main/tpes", { waitUntil: "networkidle2" });
    await clickButton(page, "LOGIN");
    addLog(`Clicked "Continue"`);

    for (const subject of subjects) {
      addLog(`Processing subject: ${subject}`);
      const clickSuccessful = await retryClickButtonByText(page, subject);

      if (!clickSuccessful) {
        addLog(`Skipping subject ${subject}, button not found.`);
        continue;
      }

      await page.waitForSelector(`input[type="radio"][value="${rateVal}"]`);
      const radioButtons = await page.$$(`input[type="radio"][value="${rateVal}"]`);
      for (const radioButton of radioButtons) {
        await radioButton.click();
        addLog("Rated successfully.");
      }

      await clickButton(page, "SUBMIT");
      await clickButton(page, "Confirm");
      await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 3000)));
      await page.reload({ waitUntil: "networkidle2" });
      addLog("Moving to the next subject.");
    }
  } catch (error) {
    addLog(`Error executing script: ${error.message}`);
    throw error;
  } finally {
    await browser.close();
  }
};

// Helper functions
const retryClickButtonByText = async (page, buttonText, retries = 10) => {
  for (let i = 0; i < retries; i++) {
    const clicked = await page.evaluate((buttonText) => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const targetButton = buttons.find((button) => button.textContent.includes(buttonText));
      if (targetButton && !targetButton.disabled) {
        targetButton.click();
        return true;
      }
      return false;
    }, buttonText);

    if (clicked) return true;
    addLog(`Retrying click on button: ${buttonText} (attempt ${i + 1})`);
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 3000)));
  }
  return false;
};

const clickButton = async (page, buttonText) => {
  await page.evaluate((buttonText) => {
    const button = Array.from(document.querySelectorAll("button")).find(
      (button) => button.textContent.includes(buttonText)
    );
    if (button) button.click();
  }, buttonText);
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
