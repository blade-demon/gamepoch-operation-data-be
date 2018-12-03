const puppeteer = require("puppeteer");

const USERNAME_SELECTOR = "input#loginname";
const PASSWORD_SELECTOR = "input[name='password']";
const LOGINBTN_SELECTOR = ".info_list.login_btn";

// 数据概览按钮
const DETAIL_BUTTON_SELECTOR = "ul.main-nav li:nth-child(1)";
const MORE_BUTTON_SELECTOR = ".card div.ft.unexpand";
// 粉丝分析
const FANS_BUTTON_SELECTOR = "ul.main-nav li:nth-child(2)";
// 博文分析
const BLOGDETAIL_BUTTON_SELECTOR = "ul.main-nav li:nth-child(3)";
// 互动分析
const INTERACT_BUTTON_SELECTOR = "ul.main-nav li:nth-child(4)";
// 文章分析
const ARTICLE_BUTTON_SELECTOR = "ul.main-nav li:nth-child(6)";

const CREDS = {
  username: "bobo@gamepoch.com",
  password: "gamepoch2016"
};

const uri = "https://weibo.com/login.php";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60 * 1000);
    await page.setViewport({ width: 1600, height: 0 });
    await page.goto(uri);

    await page.waitFor(USERNAME_SELECTOR);
    await page.waitFor(3 * 1000);
    await page.type(USERNAME_SELECTOR, CREDS.username);
    await page.type(PASSWORD_SELECTOR, CREDS.password);
    await page.click(LOGINBTN_SELECTOR);
    await page.waitFor(10 * 1000);
    await page.screenshot({
      path: "./screen.png"
    });
    // // 详细数据iframe页面
    // await page.goto("https://dss.sc.weibo.com/pc/index");
    // // let iframe = await page
    // //   .frames()
    // //   .find(f => f.name().includes("rightiframe"));
    // await page.waitFor(10 * 1000);
    // const extendButton = await page.$(MORE_BUTTON_SELECTOR);
    // const fansButton = await page.$(FANS_BUTTON_SELECTOR);
    // const blogDetailButton = await page.$(BLOGDETAIL_BUTTON_SELECTOR);
    // const interactButton = await page.$(INTERACT_BUTTON_SELECTOR);
    // const articleButton = await page.$(ARTICLE_BUTTON_SELECTOR);

    // // console.log(extendButton);
    // // 1. 获得数据概览的截屏
    // await extendButton.click();
    // await page.waitFor(10 * 1000);
    // await page.screenshot({
    //   clip: {
    //     x: 400,
    //     y: 0,
    //     width: 800,
    //     height: 2000
    //   },
    //   path: "./head.png"
    // });

    // // 2. 获得粉丝分析的截屏
    // await fansButton.click();
    // await page.waitFor(10 * 1000);
    // await page.screenshot({
    //   clip: {
    //     x: 400,
    //     y: 0,
    //     width: 800,
    //     height: 2000
    //   },
    //   path: "./fans.png"
    // });

    // // 3. 获得微博分析数据的截屏
    // await blogDetailButton.click();
    // await page.waitFor(10 * 1000);
    // await page.screenshot({
    //   clip: {
    //     x: 400,
    //     y: 0,
    //     width: 800,
    //     height: 2000
    //   },
    //   path: "./blog.png"
    // });

    // // 4. 获得互动分析的截屏
    // await interactButton.click();
    // await page.waitFor(10 * 1000);
    // await page.screenshot({
    //   clip: {
    //     x: 400,
    //     y: 0,
    //     width: 800,
    //     height: 2000
    //   },
    //   path: "./interact.png"
    // });

    // // 获得文章分析的截屏
    // await articleButton.click();
    // await page.waitFor(10 * 1000);
    // await page.screenshot({
    //   clip: {
    //     x: 400,
    //     y: 0,
    //     width: 800,
    //     height: 2000
    //   },
    //   path: "./article.png"
    // });

    // await browser.close();
    // console.log("获取数据成功");
    // process.exit(0);
  } catch (error) {
    console.log(String(error));
    await browser.close();
    process.exit(-1);
  }
})();
