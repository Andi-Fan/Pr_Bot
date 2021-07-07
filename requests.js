const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

const owner = process.env.OWNER;
const repo = process.env.REPO;
const access_token = process.env.ACCESS_TOKEN;

const bearer = 'Bearer ' + access_token;

async function fetchAllPullRequests() {
  try {
    const response = await fetch(
      //By default this endpoint only fetches open PR's
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      {
        method: "GET",
        headers: {
          'Authorization': bearer,
          'Content-Type': 'application/json'
        },
      }
    );
    const data = await response.json();
    if (response.status != 200) {
      throw Error(`${response.Error}`);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getFilesChanged(pullNumber) {
    try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/files`,
          {
            method: "GET",
            headers: {
              'Authorization': bearer,
              'Content-Type': 'application/json'
            },
          }
        );
        const data = await response.json();
        if (response.status != 200) {
          throw Error(`${response.Error}`);
        }
        return data;
      } catch (error) {
        console.error(error);
      }
}

module.exports = { fetchAllPullRequests, getFilesChanged };
