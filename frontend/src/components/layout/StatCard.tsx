interface Props {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up" | "down";
  accent?: string;
}

export default function StatCard({ label, value, delta, deltaTone = "up", accent }: Props) {
  return (
    <div className="rounded-xl2 bg-white p-4 shadow-card h-100">
      <p className="small text-slate-500 mb-1">{label}</p>
      <div className="d-flex align-items-baseline gap-2">
        <span className={`fs-3 fw-bold ${accent ?? "text-navy-900"}`}>{value}</span>
        {delta && (
          <span className={`small fw-medium ${deltaTone === "up" ? "text-teal-500" : "text-red-500"}`}>
            <i className={`ti ${deltaTone === "up" ? "ti-arrow-up" : "ti-arrow-down"}`} aria-hidden="true" /> {delta}
          </span>
        )}
      </div>
    </div>
  );
}
