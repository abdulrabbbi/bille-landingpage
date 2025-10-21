import React, { useEffect, useState, useCallback } from "react";
import ThemeSwitch from "../../iam/components/ThemeSwitch.jsx";
import KpiCard from "../components/KpiCard.jsx";
import DateRange from "../components/DateRange.jsx";
import { fetchKpis } from "../api/analytics.service.js";

export default function AnalyticsOverview() {
  const [range, setRange] = useState(() => ({
    from: Date.now() - 14 * 24 * 60 * 60 * 1000,
    to: Date.now(),
  }));
  const [kpis, setKpis] = useState(null);

  const load = useCallback(async () => {
    const res = await fetchKpis({ ...range, mineOnly: false });
    setKpis(res.data);
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted">Revenue KPIs & recent trends</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRange from={range.from} to={range.to} onChange={setRange} />
          <ThemeSwitch />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Total Sales"
          value={kpis ? `£${kpis.totalSales.toFixed(2)}` : "—"}
          spark={kpis?.spark || []}
        />
        <KpiCard
          label="Avg Ticket"
          value={kpis ? `£${kpis.avgTicket.toFixed(2)}` : "—"}
        />
        <KpiCard
          label="Refunds"
          value={kpis ? `£${kpis.refunds.toFixed(2)}` : "—"}
        />
        <KpiCard
          label="Success Rate"
          value={kpis ? kpis.successRate : "—"}
          suffix="%"
        />
      </div>

      <div className="card p-4">
        <div className="text-sm text-muted">
          Tip: Use the Transactions view for detailed exports and filters by
          method, status, and location.
        </div>
      </div>
    </div>
  );
}
