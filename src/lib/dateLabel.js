// 현재 날짜를 "2026년 5월 2주" 형식으로 표시합니다.
// 기준: 일요일부터 시작하는 달력에서 몇 번째 줄에 있는지를 주차로 봅니다.
// 예: 2026년 6월 7일은 달력의 두 번째 줄에 있으므로 "2026년 6월 2주"입니다.
export function getCurrentWeekLabel(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const firstDayOfMonth = new Date(year, date.getMonth(), 1).getDay();
  const week = Math.ceil((day + firstDayOfMonth) / 7);

  return `${year}년 ${month}월 ${week}주`;
}
