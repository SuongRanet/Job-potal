export function Brand({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`grid size-12 place-items-center rounded-full overflow-hidden`}>
        <img src="/logo.jpeg" alt="" />
      </span>
      <span
        className={`text-[15px] font-semibold tracking-tight ${onDark ? "text-white" : ""}`}
      >
        CamboWorker
      </span>
    </div>
  );
}
