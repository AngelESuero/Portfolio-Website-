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
      blue:  { background: "rgba(29, 78, 216, 0.15)", color: "#7BA3D9", border: "1px solid rgba(29, 78, 216, 0.25)" },
      amber: { background: "rgba(146, 64, 14, 0.15)", color: "#D4A574", border: "1px solid rgba(146, 64, 14, 0.25)" },
      gray:  { background: "rgba(107, 114, 128, 0.12)", color: "#9CA3AF", border: "1px solid rgba(107, 114, 128, 0.2)" },
    }[variant];
    return (
      <span style={{ ...v, fontSize: 11, padding: "3px 8px", borderRadius: 4, display: "inline-block", marginRight: 2, marginBottom: 2 }}>
        {label}
      </span>
    );
  };

  const Section = ({ number, title, subtitle, children }: { number: number; title: string; subtitle?: string; children: React.ReactNode }) => (
    <div className="mm-section-grid" style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "0 24px", paddingBottom: 28, marginBottom: 28, borderBottom: "1px solid #F3F4F6" }}>
      <div style={{ paddingTop: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 4 }}>Stage {number}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.4, marginBottom: subtitle ? 4 : 0 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.5 }}>{subtitle}</div>}
      </div>
      <div>{children}</div>
    </div>
  );

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 660, padding: "2rem 0" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #F3F4F6", flexWrap: "wrap" }}>
        {[
          { variant: "blue" as const,  label: "Survival + directly subsidized" },
          { variant: "amber" as const, label: "Survival, not subsidized" },
          { variant: "gray" as const,  label: "Desire" },
        ].map(({ variant, label }) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#6B7280" }}>
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
          <div style={{ border: "1px solid rgba(29, 78, 216, 0.25)", borderRadius: 8, padding: "10px 12px", background: "rgba(29, 78, 216, 0.08)" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#7BA3D9", marginBottom: 8 }}>Directly subsidized</div>
            {subsidized.map(m => (
              <div key={m} style={{ fontSize: 12, fontWeight: 500, color: "#9CA3AF", padding: "4px 0", borderBottom: "1px solid rgba(29, 78, 216, 0.15)" }}>{m}</div>
            ))}
          </div>
          <div style={{ border: "1px solid rgba(146, 64, 14, 0.25)", borderRadius: 8, padding: "10px 12px", background: "rgba(146, 64, 14, 0.08)" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#D4A574", marginBottom: 8 }}>Not directly subsidized</div>
            {notSubsidized.map(m => (
              <div key={m} style={{ fontSize: 12, fontWeight: 500, color: "#9CA3AF", padding: "4px 0", borderBottom: "1px solid rgba(146, 64, 14, 0.15)" }}>{m}</div>
            ))}
            <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 8, lineHeight: 1.6, opacity: 0.8 }}>
              Regulated and backstopped — not provided as a household good.
            </div>
          </div>
        </div>
      </Section>

      <Section number={3} title="Subscription model" subtitle="cities + private enterprise">
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {["City", "Private enterprise", "Large group pays nominal fee", "Access to survival markets"].map((node, i) => (
            <span key={node} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ padding: "6px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, fontWeight: 500, color: "#374151", background: "#F9FAFB" }}>
                {node}
              </span>
              {i < 3 && <span style={{ color: "#D1D5DB", fontSize: 13 }}>{i === 0 ? "+" : "→"}</span>}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.6 }}>
          Cost spread across the pool — not borne individually at market rate.
        </div>
      </Section>

      <Section number={4} title="Everything else" subtitle="personal desire, not life">
        <div style={{ lineHeight: 2, marginBottom: 14 }}>
          {desire.map(m => <Tag key={m} label={m} variant="gray" />)}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", fontStyle: "italic" }}>
          Personal desire — not life.
        </div>
      </Section>

      <div style={{ fontSize: 10, color: "#9CA3AF", lineHeight: 1.8 }}>
        * Government administration is a NAICS sector but not a market in the standard sense. Labels are translator labels, not official NAICS names.
      </div>
    </div>
  );
}
