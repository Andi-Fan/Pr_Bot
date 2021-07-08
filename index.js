const { parseTags, isSelectedTeam, createDetails } = require("./utils.js");
const { createPreviews, createModalBlocks, createPreviewsHeader } = require("./blockUtils.js");
const {
  fetchAllPullRequests,
  fetchPullRequestByNumber,
} = require("./requests.js");

const { App } = require("@slack/bolt");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.command("/prbot", async ({ command, ack, say }) => {
  await ack();

  const team = parseTags(command.text);
  if (!team) {
    return await say("*Usage: /prbot <team tag>*");
  }

  const data = await fetchAllPullRequests();

  await say({...createPreviewsHeader(team)}); //Display header

  for (let i = 0; i < data.length; i++) {
    if (isSelectedTeam(team, data[i].head.ref)) {
      //Displaying PR preview's individually, because Slack only allows 50 blocks per message
      await say({ ...createPreviews(data[i]) });
    }
  }
});

//Acknowledge review button click so slack api doesn't get mad
app.action("button-action", async ({ ack }) => {
  await ack();
});

app.action("actionId-details", async ({ body, ack, client }) => {
  await ack();

  const pullNumber = body.actions[0].value;
  const pullRequest = await fetchPullRequestByNumber(pullNumber);

  const details = { ...createDetails(pullRequest) };
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
          text: "Details",
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
