export default function MarketModel() {
  const subsidized = ["Housing", "Food", "Utilities", "Healthcare", "Transportation"];
  const notSubsidized = ["Finance / payment access"];
  const desire = [
    "Retail", "Manufacturing", "Construction", "Wholesale trade",
    "Information and media", "Professional services", "Business management",
    "Business support services", "Education and training", "Arts and entertainment",
    "Hospitality and restaurants", "Personal and repair services", "Mining and energy extraction",
  ];

  const Tag = ({ label, variant }: { label: string; variant: "blue" | "amber" | "gray" }) => {
    const v = {
      blue:  { background: "rgba(116, 156, 188, 0.16)", color: "#31506b", border: "1px solid rgba(116, 156, 188, 0.34)" },
      amber: { background: "rgba(181, 136, 78, 0.16)", color: "#7b4f1f", border: "1px solid rgba(181, 136, 78, 0.34)" },
      gray:  { background: "rgba(107, 92, 74, 0.08)", color: "#5d4f42", border: "1px solid rgba(107, 92, 74, 0.18)" },
    }[variant];
    return (
      <span style={{ ...v, fontSize: 11, padding: "3px 8px", borderRadius: 4, display: "inline-block", marginRight: 2, marginBottom: 2 }}>
        {label}
      </span>
    );
  };

  const Section = ({ number, title, subtitle, children }: { number: number; title: string; subtitle?: string; children: React.ReactNode }) => (
    <div className="mm-section-grid" style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "0 24px", paddingBottom: 28, marginBottom: 28, borderBottom: "1px solid rgba(198, 180, 151, 0.65)" }}>
      <div style={{ paddingTop: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#9b6a33", marginBottom: 4 }}>Stage {number}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#3b2b1e", lineHeight: 1.4, marginBottom: subtitle ? 4 : 0 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: "#7a6652", lineHeight: 1.5 }}>{subtitle}</div>}
      </div>
      <div>{children}</div>
    </div>
  );

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 720, padding: "0.4rem 0 0.2rem", color: "#3b2b1e" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid rgba(198, 180, 151, 0.65)", flexWrap: "wrap" }}>
        {[
          { variant: "blue" as const,  label: "Survival + directly subsidized" },
          { variant: "amber" as const, label: "Survival, not subsidized" },
          { variant: "gray" as const,  label: "Desire" },
        ].map(({ variant, label }) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#6f5c4d" }}>
            <Tag label={label} variant={variant} />
          </span>
        ))}
      </div>

      <Section number={1} title="All markets" subtitle="20 NAICS sectors">
        <div style={{ lineHeight: 2 }}>
          {subsidized.map(m => <Tag key={m} label={m} variant="blue" />)}
          {notSubsidized.map(m => <Tag key={m} label={m} variant="amber" />)}
          {desire.map(m => <Tag key={m} label={m} variant="gray" />)}
          <Tag label="Government administration *" variant="gray" />
        </div>
      </Section>

      <Section number={2} title="Survival markets" subtitle="what a person must access to live">
        <div className="mm-survival-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ border: "1px solid rgba(116, 156, 188, 0.34)", borderRadius: 8, padding: "10px 12px", background: "rgba(116, 156, 188, 0.12)" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#31506b", marginBottom: 8 }}>Directly subsidized</div>
            {subsidized.map(m => (
              <div key={m} style={{ fontSize: 12, fontWeight: 600, color: "#3b2b1e", padding: "4px 0", borderBottom: "1px solid rgba(116, 156, 188, 0.2)" }}>{m}</div>
            ))}
          </div>
          <div style={{ border: "1px solid rgba(181, 136, 78, 0.34)", borderRadius: 8, padding: "10px 12px", background: "rgba(181, 136, 78, 0.12)" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#7b4f1f", marginBottom: 8 }}>Not directly subsidized</div>
            {notSubsidized.map(m => (
              <div key={m} style={{ fontSize: 12, fontWeight: 600, color: "#3b2b1e", padding: "4px 0", borderBottom: "1px solid rgba(181, 136, 78, 0.2)" }}>{m}</div>
            ))}
            <div style={{ fontSize: 10, color: "#7a6652", marginTop: 8, lineHeight: 1.6, opacity: 0.92 }}>
              Regulated and backstopped — not provided as a household good.
            </div>
          </div>
        </div>
      </Section>

      <Section number={3} title="Subscription model" subtitle="cities + private enterprise">
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {["City", "Private enterprise", "Large group pays nominal fee", "Access to survival markets"].map((node, i) => (
            <span key={node} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ padding: "6px 12px", border: "1px solid rgba(198, 180, 151, 0.65)", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#3b2b1e", background: "rgba(255, 252, 247, 0.9)" }}>
                {node}
              </span>
              {i < 3 && <span style={{ color: "#b79e7d", fontSize: 13 }}>{i === 0 ? "+" : "→"}</span>}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#7a6652", lineHeight: 1.6 }}>
          Cost spread across the pool — not borne individually at market rate.
        </div>
      </Section>

      <Section number={4} title="Everything else" subtitle="personal desire, not life">
        <div style={{ lineHeight: 2, marginBottom: 14 }}>
          {desire.map(m => <Tag key={m} label={m} variant="gray" />)}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#5d4f42", fontStyle: "italic" }}>
          Personal desire — not life.
        </div>
      </Section>

      <div style={{ fontSize: 10, color: "#7a6652", lineHeight: 1.8 }}>
        * Government administration is a NAICS sector but not a market in the standard sense. Labels are translator labels, not official NAICS names.
      </div>
    </div>
  );
}
