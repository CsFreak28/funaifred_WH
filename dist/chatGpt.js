var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OpenAIApi, Configuration } from "openai";
function sendOpenAiRequest(gptPrompt, openai, numberOfRetries) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = "";
        yield openai
            .createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: gptPrompt,
                },
            ],
        })
            .then((res) => {
            var _a, _b;
            if (res !== undefined) {
                console.log((_a = res.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content);
                response = (_b = res.data.choices[0].message) === null || _b === void 0 ? void 0 : _b.content;
            }
        })
            .catch((e) => __awaiter(this, void 0, void 0, function* () {
            if (e.response.status === 429) {
                if (numberOfRetries < 3) {
                    console.log(e.response.status);
                    let newNumberOfRetries = numberOfRetries++;
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        response = yield sendOpenAiRequest(gptPrompt, openai, newNumberOfRetries);
                    }), 1000 * (numberOfRetries + 1));
                }
            }
        }));
        console.log(`this is the res ${response}`);
        return response;
    });
}
export function textIsAGreeting(text) {
    return __awaiter(this, void 0, void 0, function* () {
        let apiKey = process.env.OPENAI_API_KEY;
        const openai = new OpenAIApi(new Configuration({
            apiKey: apiKey,
        }));
        // console.log("this is the api key", apiKey);
        let textIsAGreeting = false;
        let gptPrompt = `is ${text} a greeting, answer only yes or no`;
        let numberOfRetries = 3;
        let response = yield sendOpenAiRequest(gptPrompt, openai, numberOfRetries);
        if (response == "Yes.") {
            textIsAGreeting = true;
        }
        return textIsAGreeting;
    });
}
export function generateMessage(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        let apiKey = process.env.OPENAI_API_KEY;
        const openai = new OpenAIApi(new Configuration({
            apiKey: apiKey,
        }));
        let promptResult = sendOpenAiRequest(prompt, openai, 3);
        return promptResult;
    });
}
export function findMeaning(usersText) {
    return __awaiter(this, void 0, void 0, function* () {
        let apiKey = process.env.OPENAI_API_KEY;
        const openai = new OpenAIApi(new Configuration({
            apiKey: apiKey,
        }));
        let listOfKeywords = [
            { keyword: "payments" },
            { keyword: "information" },
            { keyword: "records" },
            { keyword: "results" },
            { keyword: "courseMaterials" },
        ];
        let gptPrompt = `which of the following keywords does the sentence ${usersText} relate to, `;
        listOfKeywords.forEach((keyword, i) => {
            gptPrompt += `${keyword.keyword},`;
        });
        gptPrompt += ",return only the keyword";
        let numberOfRetries = 3;
        let response = yield sendOpenAiRequest(gptPrompt, openai, numberOfRetries);
        return response;
    });
}
export function whichDepartmentAndLevel(usersText) {
    return __awaiter(this, void 0, void 0, function* () {
        let listOfDepartmentsAndTheirAbbr = [
            "(Computer Science,CSC,CS)",
            "(Mathematics Education)",
            "(Human Anatomy,Anat)",
            "(Mass Communication,MassComm)",
        ];
        let gptPrompt = `This is a list of university departments and their abbreviations`;
        listOfDepartmentsAndTheirAbbr.forEach((deptAbbr) => {
            gptPrompt += `${deptAbbr},`;
        });
        gptPrompt += `from the given text "${usersText}" extract the number and the university department from the given text, return them in this format eg CSC100 or ({department}{number})`;
        let apiKey = process.env.OPENAI_API_KEY;
        const openai = new OpenAIApi(new Configuration({
            apiKey: apiKey,
        }));
        let numberOfRetries = 3;
        let response = yield sendOpenAiRequest(gptPrompt, openai, numberOfRetries);
        return response;
    });
}
