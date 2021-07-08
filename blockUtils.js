function createPreviewsHeader(team) {
  const header = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hello, below you will find previews for all open pull requests for *${team}* team`,
        },
      },
    ],
  };
  return header;
}

function createPreviews(pullRequest) {
  const created_on = new Date(pullRequest.created_at);
  const updated_on = new Date(pullRequest.updated_at);
  const preview = {
    blocks: [
      {
        type: "divider",
      },
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${pullRequest.head.ref}`,
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
            image_url: `${pullRequest.user.avatar_url}`,
            alt_text: "user.avatar_url",
          },
          {
            type: "plain_text",
            text: `Author: ${pullRequest.user.login}`,
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
            value: `${pullRequest.number}`,
            action_id: "actionId-details",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Review",
              emoji: true,
            },
            value: `${pullRequest.number}`,
            url: `${pullRequest.html_url}`,
            action_id: "button-action",
          },
        ],
      },
    ],
  };
  return preview;
}

function createModalBlocks(details) {
  const modalBlocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${details.title}`,
        emoji: true,
      },
    },
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
  createPreviewsHeader,
};
