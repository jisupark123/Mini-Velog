export function cls(...classNames: string[]) {
  console.log(classNames);
  return classNames.join(' ');
}

export function getTags(tags: string) {
  if (!tags) {
    return [];
  }
  const res = tags
    .replace(/\s+/g, ' ') // '   ' => ' '
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length !== 0);
  return res;
}

export function getDateDiff(d1: Date | string, d2: Date | string) {
  const date1 = new Date(d1);
  const date2 = new Date(d2);

  // 초 차이
  let diff = Math.abs((date1.getTime() - date2.getTime()) / 1000);
  if (diff < 60) {
    return `${Math.floor(diff)}초`;
  }

  // 분 차이
  diff /= 60;
  if (diff < 60) {
    return `${Math.floor(diff)}분`;
  }

  // 시간 차이
  diff /= 60;
  if (diff < 24) {
    return `${Math.floor(diff)}시간`;
  }

  // 일 차이
  diff /= 24;
  if (diff < 31) {
    return `${Math.floor(diff)}일`;
  }

  // 달 차이
  diff /= 30;
  if (diff < 12) {
    return `${Math.floor(diff)}달`;
  }

  // 년 차이
  diff /= 12;
  return `${Math.floor(diff)}년`;
}
