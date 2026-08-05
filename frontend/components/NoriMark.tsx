export function NoriMark({
  size = 14,
  strokeWidth = 2.5,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12c.5-2 2-3 3.5-3s3 2.5 5 2.5 3.5-3 5-3 3 1 3.5 3" />
    </svg>
  );
}
