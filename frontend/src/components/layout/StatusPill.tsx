const styles: Record<string, string> = {
  active: "bg-teal-50 text-teal-700",
  frozen: "bg-amber-50 text-amber-700",
  pending: "bg-amber-50 text-amber-700",
  new: "bg-amber-50 text-amber-700",
  accepted: "bg-blue-50 text-blue-700",
  "in progress": "bg-blue-50 text-blue-700",
  // "Out for delivery" is how the order looks to the customer once the
  // partner has handed it off — with the delivery company, on its way.
  "out for delivery": "bg-blue-50 text-blue-700",
  completed: "bg-teal-50 text-teal-700",
  cancelled: "bg-red-50 text-red-700",
};

// Friendlier labels than the raw backend status string — e.g. an order's
// orderStatus of "completed" is shown to everyone as "Delivered", and
// "out_for_delivery" reads as "Out for delivery" instead of a raw enum value.
const labels: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  "out for delivery": "Out for delivery",
  completed: "Delivered",
  cancelled: "Cancelled",
};

export default function StatusPill({ status }: { status: string }) {
  const key = status.toLowerCase().replace(/_/g, " ");
  const label = labels[key] ?? status.replace(/_/g, " ");
  return (
    <span className={`badge rounded-pill fw-semibold text-capitalize ${styles[key] ?? "bg-slate-100 text-slate-600"}`}>
      {label}
    </span>
  );
}
