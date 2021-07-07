const { parseTags, isSelectedTeam, getPullRequestAge } = require("./utils.js");
const { createPreviews, createModalBlocks } = require("./blockUtils.js");
const {
  fetchAllPullRequests,
  fetchPullRequestByNumber,
} = require("./requests.js");

const { App } = require("@slack/bolt");
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
});

//TODO add command for setting up and disabling a periodic alert

app.command("/prbot", async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  const team = parseTags(command.text);
  if (!team) {
    return await say("*Usage: /prbot <team tag>*");
  }

  const data = await fetchAllPullRequests();
  const pullRequests = [];

  for (let i = 0; i < data.length; i++) {
    if (isSelectedTeam(team, data[i].head.ref)) {
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

app.action("actionId-details", async ({ body, ack, say, client }) => {
  // Acknowledge button click event
  await ack();

  const pullNumber = body.actions[0].value;
  const pullRequest = await fetchPullRequestByNumber(pullNumber);

  const now = new Date()
  const openDate = new Date(pullRequest.created_at);
  const cycleAge = getPullRequestAge(openDate, now); //age in hours
  
  const details = {
    title: pullRequest.head.ref,
    numFilesChanged: pullRequest.changed_files,
    numCommits: pullRequest.commits,
    numInsertions: pullRequest.additions,
    numDeletions: pullRequest.deletions,
    link: pullRequest.html_url,
    base: pullRequest.base.ref,
    author: pullRequest.user.login,
    avatar: pullRequest.user.avatar_url,
    age: cycleAge,
  };

  const modalBlocks = createModalBlocks(details);

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        callback_id: "view_1",
        title: {
          type: "plain_text",
          text: `${details.title}`,
        },
        blocks: [...modalBlocks],
      },
    });
  } catch (error) {
    console.error(error);
  }
});

//bot startup
(async () => {
  await app.start(process.env.PORT || 3000);

  console.log("PR Bot: Bolt app is running!");
})();
