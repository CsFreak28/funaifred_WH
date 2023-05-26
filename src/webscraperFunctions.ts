import puppeteer from "puppeteer";
import { uploadImageToFirebase } from "./cloudStorage.js";
// import { ElementHandle } from "puppeteer-core";
export async function getResult(
  userDetails: {
    userName: string;
    password: string;
    phoneNumber: string;
    level: string;
    usersDept: string;
    semester: string;
  },
  session: number,
  semester: number
) {
  let timer = 0;
  setInterval(() => {
    timer++;
  }, 1000);
  const browser = await puppeteer.launch({
    headless: "new",
  });
  try {
    const tab = await browser.newPage();
    console.log("browser opened", timer);
    tab.setDefaultNavigationTimeout(0);
    await loginToPortal(userDetails, tab);
    console.log(timer);
    tab.on("dialog", async (dialog) => {
      console.log(dialog.message());
      console.log("a dialog showed up");
      throw new Error("incorrect user details");
      dialog.accept();
    });
    await Promise.all([
      tab.goto(
        "https://portal.funai.edu.ng/modules/results/viewresultlogin.aspx"
      ),
      tab.waitForNavigation(),
    ]);
    console.log(semester);
    const semesterValue = await tab.$eval(
      "#ctl00_formMain_ddlSemester",
      (sl, semester) => {
        return (sl.children[semester] as HTMLInputElement).value;
      },
      semester
    );
    const semesterSelect = await tab.$("#ctl00_formMain_ddlSemester");
    await (semesterSelect as puppeteer.ElementHandle<Element>).select(
      semesterValue
    );
    const sessionValue = await tab.$eval(
      "#ctl00_formMain_ddlSession",
      (sl, session) => {
        return (sl.children[session] as HTMLInputElement).value;
      },
      session
    );
    console.log(sessionValue);
    const sessionSelect = await tab.$("#ctl00_formMain_ddlSession");
    await (sessionSelect as puppeteer.ElementHandle<Element>).select(
      sessionValue
    );
    await tab.waitForSelector("#ctl00_formMain_ddlSession");
    const submitButton = (await tab.$(
      "#ctl00_formMain_btnPay3"
    )) as puppeteer.ElementHandle<Element>;
    await Promise.all([submitButton.click(), tab.waitForNavigation()]);
    let h3Text = await tab.$eval("h3", (el) => el.textContent);
    console.log(h3Text);
    await tab.waitForSelector("#G_ctl00xformMainxuwgCourses");
    const tb = await tab.$$eval(
      "table#G_ctl00xformMainxuwgCourses tbody tr",
      (t) => {
        let grades: Array<any> = [];
        let tableArrangement = [
          "course code",
          "course title",
          "course unit",
          "ass score",
          "test score",
          "exam score",
          "total",
          "grade",
        ];
        t.forEach((el) => {
          let tableData = el.querySelectorAll("td");
          let obj: {
            [key: string]: string | null;
          } = {};
          tableData.forEach((td, j) => {
            obj[`${tableArrangement[j]}`] =
              td.querySelectorAll("nobr")[0].textContent;
          });
          grades.push(obj);
        });
        return grades;
      }
    );
    console.log("this is the tbody", tb);
    let screenShot = await tab.pdf();
    const b64 = Buffer.from(screenShot).toString("base64");
    await uploadImageToFirebase(b64, userDetails);
    console.log(timer);
    await browser.close();
  } catch (err) {
    console.log("this is the error", err);
    return;
  }
  await browser.close();
}
type userDetails = {
  userName: string;
  password: string;
  phoneNumber: string;
};

async function loginToPortal(userDetails: userDetails, tab: puppeteer.Page) {
  console.log("logging into your portal");
  let returnValue = "no error";
  await tab.goto("https://portal.funai.edu.ng/").catch((e) => {
    console.log("there was an error connecting to the school's portal");
    returnValue = "connection error";
  });
  //get the inputs on login page and type in users details
  const firstInput = await tab.$("#txtusername");
  await (firstInput as puppeteer.ElementHandle<Element>).type(
    userDetails.userName
  );
  const secondInput = await tab.$("#txtPassword");
  await (secondInput as puppeteer.ElementHandle<Element>).type(
    userDetails.password
  );
  const loginButton = await tab.$("#btnLogin");
  //click the button, wait for the button to resolve and then wait for the tab to navigate to the dashboard
  await Promise.all([
    (loginButton as puppeteer.ElementHandle<Element>).click(),
    tab.waitForNavigation(),
  ])
    .then(() => {
      console.log("FB:logged in to your portal");
    })
    .catch((e) => {
      returnValue = "incorrect details";
    });
  console.log("this is the return value", returnValue);
  return returnValue;
}
