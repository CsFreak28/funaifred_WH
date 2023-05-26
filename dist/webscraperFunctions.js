var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from "puppeteer";
import { uploadImageToFirebase } from "./cloudStorage.js";
// import { ElementHandle } from "puppeteer-core";
export function getResult(userDetails, session, semester) {
    return __awaiter(this, void 0, void 0, function* () {
        let timer = 0;
        setInterval(() => {
            timer++;
        }, 1000);
        const browser = yield puppeteer.launch({
            headless: "new",
        });
        try {
            const tab = yield browser.newPage();
            console.log("browser opened", timer);
            tab.setDefaultNavigationTimeout(0);
            yield loginToPortal(userDetails, tab);
            console.log(timer);
            tab.on("dialog", (dialog) => __awaiter(this, void 0, void 0, function* () {
                console.log(dialog.message());
                console.log("a dialog showed up");
                throw new Error("incorrect user details");
                dialog.accept();
            }));
            yield Promise.all([
                tab.goto("https://portal.funai.edu.ng/modules/results/viewresultlogin.aspx"),
                tab.waitForNavigation(),
            ]);
            console.log(semester);
            const semesterValue = yield tab.$eval("#ctl00_formMain_ddlSemester", (sl, semester) => {
                return sl.children[semester].value;
            }, semester);
            const semesterSelect = yield tab.$("#ctl00_formMain_ddlSemester");
            yield semesterSelect.select(semesterValue);
            const sessionValue = yield tab.$eval("#ctl00_formMain_ddlSession", (sl, session) => {
                return sl.children[session].value;
            }, session);
            console.log(sessionValue);
            const sessionSelect = yield tab.$("#ctl00_formMain_ddlSession");
            yield sessionSelect.select(sessionValue);
            yield tab.waitForSelector("#ctl00_formMain_ddlSession");
            const submitButton = (yield tab.$("#ctl00_formMain_btnPay3"));
            yield Promise.all([submitButton.click(), tab.waitForNavigation()]);
            let h3Text = yield tab.$eval("h3", (el) => el.textContent);
            console.log(h3Text);
            yield tab.waitForSelector("#G_ctl00xformMainxuwgCourses");
            const tb = yield tab.$$eval("table#G_ctl00xformMainxuwgCourses tbody tr", (t) => {
                let grades = [];
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
                    let obj = {};
                    tableData.forEach((td, j) => {
                        obj[`${tableArrangement[j]}`] =
                            td.querySelectorAll("nobr")[0].textContent;
                    });
                    grades.push(obj);
                });
                return grades;
            });
            console.log("this is the tbody", tb);
            let screenShot = yield tab.pdf();
            const b64 = Buffer.from(screenShot).toString("base64");
            yield uploadImageToFirebase(b64, userDetails);
            console.log(timer);
            yield browser.close();
        }
        catch (err) {
            console.log("this is the error", err);
            return;
        }
        yield browser.close();
    });
}
function loginToPortal(userDetails, tab) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("logging into your portal");
        let returnValue = "no error";
        yield tab.goto("https://portal.funai.edu.ng/").catch((e) => {
            console.log("there was an error connecting to the school's portal");
            returnValue = "connection error";
        });
        //get the inputs on login page and type in users details
        const firstInput = yield tab.$("#txtusername");
        yield firstInput.type(userDetails.userName);
        const secondInput = yield tab.$("#txtPassword");
        yield secondInput.type(userDetails.password);
        const loginButton = yield tab.$("#btnLogin");
        //click the button, wait for the button to resolve and then wait for the tab to navigate to the dashboard
        yield Promise.all([
            loginButton.click(),
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
    });
}
