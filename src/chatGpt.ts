import { OpenAIApi, Configuration } from "openai";
async function sendOpenAiRequest(
  gptPrompt: string,
  openai: OpenAIApi,
  numberOfRetries: number
) {
  let response: string | undefined | Promise<string> = "";
  await openai
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
      if (res !== undefined) {
        console.log(res.data.choices[0].message?.content);
        response = res.data.choices[0].message?.content;
      }
    })
    .catch(async (e) => {
      if (e.response.status === 429) {
        if (numberOfRetries < 3) {
          console.log(e.response.status);
          let newNumberOfRetries = numberOfRetries++;
          setTimeout(async () => {
            response = await sendOpenAiRequest(
              gptPrompt,
              openai,
              newNumberOfRetries
            );
          }, 1000 * (numberOfRetries + 1));
        }
      }
    });
  console.log(`this is the res ${response}`);
  return response;
}

export async function textIsAGreeting(text: string): Promise<boolean> {
  let apiKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: apiKey,
    })
  );
  // console.log("this is the api key", apiKey);
  let textIsAGreeting: boolean = false;
  let gptPrompt: string = `is ${text} a greeting, answer only yes or no`;
  let numberOfRetries = 3;
  let response = await sendOpenAiRequest(gptPrompt, openai, numberOfRetries);
  if (response == "Yes.") {
    textIsAGreeting = true;
  }
  return textIsAGreeting;
}
export async function generateMessage(prompt: string) {
  let apiKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: apiKey,
    })
  );
  let promptResult = sendOpenAiRequest(prompt, openai, 3);
  return promptResult;
}
export async function findMeaning(usersText: string) {
  let apiKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: apiKey,
    })
  );
  let listOfKeywords = [
    { keyword: "payments" },
    { keyword: "information" },
    { keyword: "records" },
    { keyword: "results" },
    { keyword: "courseMaterials" },
  ];
  let gptPrompt: string = `which of the following keywords does the sentence ${usersText} relate to, `;
  listOfKeywords.forEach((keyword, i) => {
    gptPrompt += `${keyword.keyword},`;
  });
  gptPrompt += ",return only the keyword";
  let numberOfRetries = 3;
  let response = await sendOpenAiRequest(gptPrompt, openai, numberOfRetries);
  return response;
}

export async function whichDepartmentAndLevel(usersText: string) {
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
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: apiKey,
    })
  );
  let numberOfRetries = 3;
  let response = await sendOpenAiRequest(gptPrompt, openai, numberOfRetries);
  return response;
}
