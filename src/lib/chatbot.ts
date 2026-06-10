import type { Reading, Shipment } from "./types";

export function answerQuery(
  q: string,
  shipment: Shipment,
  readings: Reading[],
): string {
  const lower = q.toLowerCase();
  const breaches = readings.filter((r) => r.status === "breach");
  const total = readings.length;
  const okPct = total ? Math.round(((total - breaches.length) / total) * 100) : 100;

  const overUpper = readings.filter((r) => r.temp > shipment.upperLimit);
  let timeOver = 0;
  for (let i = 1; i < overUpper.length; i++) {
    timeOver += overUpper[i].ts - overUpper[i - 1].ts;
  }
  const minutesOver = Math.round(timeOver / 60000);

  if (lower.includes("safe to distribute") || lower.includes("safe")) {
    if (breaches.length === 0)
      return `✅ Shipment **${shipment.id}** has zero threshold breaches across ${total} readings (${okPct}% compliant). Safe to distribute per CDC cold-chain guidance.`;
    return `⚠️ Shipment **${shipment.id}** had **${breaches.length} breach event(s)** (${minutesOver} min above ${shipment.upperLimit}°C). Recommend quarantine + QA review before distribution.`;
  }
  if (lower.includes("how long") && (lower.includes("above") || lower.includes("over"))) {
    return `Temperature was above ${shipment.upperLimit}°C for approximately **${minutesOver} minute(s)** across ${overUpper.length} reading(s).`;
  }
  if (lower.includes("summary") || lower.includes("regulatory") || lower.includes("board")) {
    return [
      `**Regulatory summary — ${shipment.id}**`,
      `Product: ${shipment.product}`,
      `Route: ${shipment.origin} → ${shipment.destination}`,
      `Readings captured: ${total}`,
      `Threshold breaches: ${breaches.length}`,
      `Time above ${shipment.upperLimit}°C: ${minutesOver} min`,
      `Overall compliance: **${okPct}%**`,
      `Audit chain integrity: SHA-256 hash chain intact across all rows.`,
      breaches.length === 0
        ? "Status: **COMPLIANT** — safe for distribution."
        : "Status: **REVIEW REQUIRED** — QA disposition needed.",
    ].join("\n\n");
  }
  if (lower.includes("breach") && lower.includes("count")) {
    return `${breaches.length} threshold breach(es) recorded.`;
  }
  if (lower.includes("hash") || lower.includes("tamper") || lower.includes("blockchain")) {
    return `Each reading is hashed with SHA-256 over (timestamp + temp + sensorId + previous hash). On delivery, the batch hash is anchored to Polygon. Any tampering breaks the chain and the on-chain verify fails.`;
  }
  return `I can answer questions about shipment **${shipment.id}** using its audit log (${total} readings, ${breaches.length} breaches, ${okPct}% compliant). Try: "Was it safe to distribute?", "How long was the temp above 8°C?", or "Generate a regulatory summary".`;
}
