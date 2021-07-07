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
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Details",
              emoji: true,
            },
            value: `${pullRequests[i].number}`,
            action_id: "actionId-details",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Review",
              emoji: true,
            },
            value: `${pullRequests[i].number}`,
            url: `${pullRequests[i].html_url}`,
            action_id: "button-action",
          },
        ],
      }
    );
  }
  return previewList;
}

function createModalBlocks(details) {
  const modalBlocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Merging *${details.numCommits} commit(s)* into :github: *${details.base}*`,
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Review",
          emoji: true,
        },
        value: "click_me_123",
        url: `${details.link}`,
        action_id: "button-action",
      },
    },
    {
      type: "divider",
    },
    {
      type: "context",
      elements: [
        {
          type: "plain_text",
          text: `++${details.numInsertions} lines of insertion \n --${details.numDeletions} lines of deletion`,
          emoji: true,
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "context",
      elements: [
        {
          type: "image",
          image_url: `${details.avatar}`,
          alt_text: "user.avatar_url",
        },
        {
          type: "mrkdwn",
          text: `*${details.numFilesChanged} files changed by ${details.author}*`,
        },
      ],
    },
  ];
  return modalBlocks;
}

module.exports = {
  parseTags,
  isSelectedTeam,
  createPreviews,
  createModalBlocks,
};
