export default function getLastDate(dateStr: string): string {
  const mlsds = new Date().getTime() - new Date(dateStr).getTime();
  let result: string = "";

  //   seconds after dateStr
  let timeAgo = mlsds / 1000;

  if (timeAgo < 60) {
    result = `less than 1 minute`;
    return result + " ago";
  } else {
    //   minutes after dateStr
    timeAgo /= 60;
  }

  if (timeAgo < 60) {
    const minutes = Math.floor(timeAgo);
    result = `${minutes} minute${minutes === 1 ? "" : "s"}`;
    return result + " ago";
  } else {
    //   hours after dateStr
    timeAgo /= 60;
  }

  if (timeAgo < 24) {
    const hours = Math.floor(timeAgo);
    result = `${hours} hour${hours === 1 ? "" : "s"}`;
    return result + " ago";
  } else {
    //   days after dateStr
    timeAgo /= 24;
  }

  const days = Math.floor(timeAgo);
  result = `${days} day${days === 1 ? "" : "s"}`;
  return result + " ago";
}
