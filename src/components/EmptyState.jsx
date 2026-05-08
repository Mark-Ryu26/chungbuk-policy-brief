export default function EmptyState({ message = "등록된 정책동향이 없습니다." }) {
  return <p className="state-message muted">{message}</p>;
}
