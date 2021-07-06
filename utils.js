function parseTags(text) {
  //TODO filter among options BMS, CORE, QUOTE, DATA, PLATFORM
  return text;
}

function isSelectedTeam(teamTag, branchName) {
  return true;
}

function createPreviews(pullRequests) {
  const previewList = [];
  for (let i = 0; i < pullRequests.length; i++) {
    previewList.push(
      {
        type: "divider",
      },
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${pullRequests[i].head.ref}`,
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${pullRequests[i].number} changed files into :github: *${pullRequests[i].base.ref}*`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Review",
            emoji: true,
          },
          value: "click_me_123",
          url: `${pullRequests[i].html_url}`,
          action_id: "button-action",
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Opened:* ${pullRequests[i].created_at} \n *Last Updated:* ${pullRequests[i].updated_at}`,
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "image",
            image_url: `${pullRequests[i].user.avatar_url}`,
            alt_text: "user.avatar_url",
          },
          {
            type: "plain_text",
            text: `Author: ${pullRequests[i].user.login}`,
            emoji: true,
          },
        ],
      }
    );
  }
  return previewList;
}

module.exports = { parseTags, isSelectedTeam, createPreviews };
