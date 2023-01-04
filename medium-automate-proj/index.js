const puppeteer = require("puppeteer");

const urlMain = "https://medium.com";

// Currently an anonymous async/await function - can be renamed
(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  // SCREENSHOT
  await page.goto(urlMain);

  // LOGIN - LINK ONLY VALID FOR 20 MINUTES // NO LONGER ACTIVE
  const login_Link =
    "https://medium.com/m/callback/email?token=450d0f30dab6&operation=login&state=medium";
  await page.goto(login_Link);

  // EDIT PAGE
  const edit_Page = "https://medium.com/p/96fe4266534f/edit";
  await page.goto(edit_Page);

  await page.waitForSelector(p[(id = "a46a")]);
  await page.$eval("p[id='a46a']", (e) => {
    e.innerHTML = new Date().toLocaleString("en-US");
  });

  // PUBLISH PAGE - waits 6000 miliseconds, then clicks
  await page.waitFor(6000);
  await page.click('button[data-action="republish"]');

  await page.screenshot({ path: "medium.png" });
  await browser.close();
})();
