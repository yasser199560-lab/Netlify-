import {
  OrderStatusFilter,
  DateFilter,
  ORDER_STATUS_LABELS,
  DATE_FILTER_LABELS,
  OrderFilterState,
} from "../types/admin.types";

const STATUS_OPTIONS: OrderStatusFilter[] = ["all", "pending", "accepted", "out_for_delivery", "completed", "cancelled"];
const DATE_OPTIONS: DateFilter[] = ["all", "today", "last7", "last30", "month", "custom"];

interface Props {
  value: OrderFilterState;
  onChange: (next: OrderFilterState) => void;
}

// Renders the status dropdown, the date-range dropdown, and (only when
// "Custom Range" is picked) the two date inputs. The parent owns the state
// and is responsible for re-querying the backend when it changes — this
// component only edits the filter object, it never fetches anything itself.
export default function OrderFiltersBar({ value, onChange }: Props) {
  return (
    <div className="d-flex flex-wrap align-items-end gap-2 mb-3">
      <div>
        <label className="form-label small text-muted mb-1">Status</label>
        <select
          className="form-select form-select-sm"
          value={value.status}
          onChange={(e) => onChange({ ...value, status: e.target.value as OrderStatusFilter })}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label small text-muted mb-1">Date</label>
        <select
          className="form-select form-select-sm"
          value={value.dateFilter}
          onChange={(e) => onChange({ ...value, dateFilter: e.target.value as DateFilter })}
        >
          {DATE_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {DATE_FILTER_LABELS[d]}
            </option>
          ))}
        </select>
      </div>

      {value.dateFilter === "custom" && (
        <>
          <div>
            <label className="form-label small text-muted mb-1">From</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={value.startDate}
              max={value.endDate || undefined}
              onChange={(e) => onChange({ ...value, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label small text-muted mb-1">To</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={value.endDate}
              min={value.startDate || undefined}
              onChange={(e) => onChange({ ...value, endDate: e.target.value })}
            />
          </div>
        </>
      )}

      {(value.status !== "all" || value.dateFilter !== "all") && (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onChange({ status: "all", dateFilter: "all", startDate: "", endDate: "" })}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
