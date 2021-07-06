const { parseTags, isSelectedTeam, createPreviews } = require("./utils.js");
const { fetchAllPullRequests, getFilesChanged } = require("./requests.js");

const { App } = require("@slack/bolt");
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

const NUM_REVIEWS_REQUIRED = 2;

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
});

/* 
  Event listener for prbot command. Displays all open PRS for the specified team
*/
app.command("/prbot", async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  const team = parseTags(command.text);
  const data = await fetchAllPullRequests();
  const pullRequests = [];

  //TODO, refactor this to use filter
  for (let i = 0; i < data.length; i++) {
    if (isSelectedTeam(team, data[i].head.ref)) {//TODO add check if pr is closed/merged
      pullRequests.push(data[i]);
    }
  }
  const previews = createPreviews(pullRequests);
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hello, below you will find previews for all open pull requests for *${team}* team`,
        },
      },
      ...previews,
    ], 
  });
 
});

app.action("button-action", async ({ body, ack, say }) => {
  // Acknowledge button click event
  await ack();
});

(async () => {
  // bot startup
  await app.start(process.env.PORT || 3000);

  console.log("PR Bot: Bolt app is running!");
})();
