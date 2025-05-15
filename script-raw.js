import puppeteer from "puppeteer";

const credential = ["username", "password"];
  const subjects = [
    "M130 - Phlo 11",
    "G003 - CSci 13",
    "G004 - CSci 13",
    "G072 - CSci 15n",
    "D189 - Entr 11",
    "M945 - Humn 13n",
    "W176 - PhEd 13n",
    "C082 - CSci 103"
  ];
const rateVal = 3;// Change this to the desired rating value (1-5)

const retryClickButtonByText = async (page, buttonText, retries = 10) => {
  for (let i = 0; i < retries; i++) {
    const clicked = await page.evaluate((buttonText) => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const targetButton = buttons.find((button) =>
        button.textContent.includes(buttonText)
      );
      if (targetButton && !targetButton.disabled) {
        targetButton.click();
        return true;
      }
      return false;
    }, buttonText);

    if (clicked) {
      console.log(`Clicked the ${buttonText} button.`);
      return true;
    }

    console.log(`Attempt ${i + 1}: Button not found, retrying...`);
    await page.evaluate(
      () => new Promise((resolve) => setTimeout(resolve, 3000))
    );
  }

  console.error("Failed to click the button after multiple attempts.");
  return false;
};

const clickButton = async (page, buttonText) => {
  await page.evaluate((buttonText) => {
    const button = Array.from(document.querySelectorAll("button")).find(
      (button) => button.textContent.includes(buttonText)
    );
    if (button) {
      button.click();
      console.log(`Clicked the ${buttonText} button.`);
    } else {
      console.error(`${buttonText} button not found.`);
    }
  }, buttonText);
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://my.vsu.edu.ph/auth/login", { waitUntil: "networkidle2" });
  
  console.log("Logging In...");

  await page.waitForSelector('input[formcontrolname="username"]');
  await page.type('input[formcontrolname="username"]', credential[0]);
  await page.waitForSelector('input[formcontrolname="password"]');
  await page.type('input[formcontrolname="password"]', credential[1]);

  await clickButton(page, "LOGIN");
  console.log("Log in session started, huwata....");

  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.goto("https://my.vsu.edu.ph/main/tpes", { waitUntil: "networkidle2" });
  console.log("LOGGED IN");

  await page.waitForSelector('button[aria-label="Continue"]', {
    timeout: 60000,
  });
  await page.click('button[aria-label="Continue"]');
  console.log("Clicked Continue button.");

  for (let i = 0; i < subjects.length; i++) {
    const subject = subjects[i];
    console.log(`Attempting to automate TPES, subject: ${subject}`);

    const clickSuccessful = await retryClickButtonByText(page, subject);
    if (clickSuccessful) {
      console.log(`TPES automation will start for ${subject} shortly.`);
    } else {
      console.log(`${subject} button could not be clicked.`);
      continue;
    }

    await page.waitForSelector(input[type="radio"][value="${rateVal}"], {
      visible: true,
    });
    const radioButtons = await page.$$(input[type="radio"][value="${rateVal}"]);
    for (const radioButton of radioButtons) {
      await radioButton.click();
      console.log("Done rating");
    }

    await clickButton(page, "SUBMIT");
    await clickButton(page, "Confirm");

    await page.evaluate(
      () => new Promise((resolve) => setTimeout(resolve,3000))
    );

    await page.reload({ waitUntil: "networkidle2" });
    console.log("Complete moving to the next one");

    await page.waitForSelector('button[aria-label="Continue"]', {
      timeout: 60000,
    });
    await page.click('button[aria-label="Continue"]');
    console.log("Clicked Continue button after reload.");

    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 1000)));
  }

  console.log("All subjects processed successfully.");
  await browser.close();
})();