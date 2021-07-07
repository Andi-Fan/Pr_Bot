function createPreviews(pullRequests) {
  const previewList = [];
  for (let i = 0; i < pullRequests.length; i++) {
    let created_on = new Date(pullRequests[i].created_at);
    let updated_on = new Date(pullRequests[i].updated_at);
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
            text: `*Opened:* ${created_on.toDateString()} \n *Last Updated:* ${updated_on.toDateString()}`,
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
            type: "mrkdwn",
            text: `Pull request has been opened for *${details.age}* hours`,
          },
        ],
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
  createPreviews,
  createModalBlocks,
};
