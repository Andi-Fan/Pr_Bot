function parseTags(text) {
  if (text.includes("bms") || text.includes("BMS")) {
    return "BMS";
  } else if (text.includes("core") || text.includes("CORE")) {
    return "CORE";
  } else if (text.includes("quote") || text.includes("QUOTE")) {
    return "QUOTE";
  } else if (text.includes("data") || text.includes("DATA")) {
    return "DATA";
  } else if (text.includes("all") || text.includes("ALL")) {
    return "ALL";
  }
  return null;
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

function getPullRequestAge(dateOpen, now){
  const diff = (now.getTime() - dateOpen.getTime())/(1000 * 60 * 60); //diff in hours
  return Math.floor(diff);
}

function createDetails(pullRequest){
  const now = new Date();
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

  return details;
}

module.exports = {
  parseTags,
  isSelectedTeam,
  createDetails,
};
