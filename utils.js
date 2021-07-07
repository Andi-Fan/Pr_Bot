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

module.exports = {
  parseTags,
  isSelectedTeam,
  getPullRequestAge
};
