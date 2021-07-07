function parseTags(text) {
  if (text.includes("bms") || text.includes("BMS")) {
    return "BMS";
  } else if (text.includes("core") || text.includes("CORE")) {
    return "CORE";
  } else if (text.includes("quote") || text.includes("QUOTE")) {
    return "QUOTE";
  } else if (text.includes("data") || text.includes("DATA")) {
    return "DATA";
  }
  return "ALL";
}

function isSelectedTeam(teamTag, branchName) {
  if (teamTag === "ALL") {
    return true;
  }
  return (
    branchName.includes(teamTag.toLowerCase()) ||
    branchName.includes(teamTag.toUpperCase())
  );
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
