import React from "react";

async function getHubspotData() {
  const res = await fetch("http://localhost:3000/api/hubspot", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch HubSpot data from /api/hubspot");
  }

  return res.json();
}

export default async function CrmPage() {
  const data = await getHubspotData();

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>CRM Dashboard (HubSpot Data)</h1>

      <p style={{ marginTop: 8, marginBottom: 16 }}>
        Total Deals: <b>{data.length}</b>
      </p>

      {/* Horizontal scroll so all columns can be seen */}
      <div
        style={{
          overflowX: "auto",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 1200,
          }}
        >
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={thStyle}>Deal</th>
              <th style={thStyle}>Owner</th>
              <th style={thStyle}>Stage</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Probability</th>
              <th style={thStyle}>Weighted Amount</th>
              <th style={thStyle}>Last Activity Date</th>
              <th style={thStyle}>Close Date</th>
              <th style={thStyle}>Record ID</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d: any, i: number) => (
              <tr key={i}>
                <td style={tdStyle}>{d.dealName || "-"}</td>
                <td style={tdStyle}>{d.dealOwner || "-"}</td>
                <td style={tdStyle}>{d.dealStage || "-"}</td>
                <td style={tdStyle}>{d.amount ?? "-"}</td>
                <td style={tdStyle}>{d.dealProbability ?? "-"}</td>
                <td style={tdStyle}>{d.weightedAmount ?? "-"}</td>
                <td style={tdStyle}>{d.lastActivityDate || "-"}</td>
                <td style={tdStyle}>{d.closeDate || "-"}</td>
                <td style={tdStyle}>{d.recordId || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 12, color: "#6b7280", fontSize: 13 }}>
        Tip: Scroll left/right to view all columns.
      </p>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  borderBottom: "1px solid #e5e7eb",
  padding: "10px 12px",
  textAlign: "left",
  fontWeight: 700,
  fontSize: 13,
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  borderBottom: "1px solid #e5e7eb",
  padding: "10px 12px",
  fontSize: 13,
  whiteSpace: "nowrap",
};