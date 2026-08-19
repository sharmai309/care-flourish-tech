export type VitalsReading = {
  heartRate: number;
  systolic: number;
  diastolic: number;
  spo2: number;
  at: number;
};

export type AlertLevel = "critical" | "warning";

export type VitalsAlert = {
  id: string;
  level: AlertLevel;
  metric: string;
  message: string;
  value: string;
  at: number;
  acknowledged: boolean;
};

export type ConnectionMode = "offline" | "simulated" | "bluetooth";

export const THRESHOLDS = {
  heartRate: { low: 50, high: 110, criticalLow: 42, criticalHigh: 125 },
  systolic: { low: 95, high: 145, criticalLow: 85, criticalHigh: 165 },
  diastolic: { low: 55, high: 92, criticalLow: 48, criticalHigh: 105 },
  spo2: { low: 93, high: 100, criticalLow: 89, criticalHigh: 101 },
};

type Range = { low: number; high: number; criticalLow: number; criticalHigh: number };

export function evaluate(value: number, r: Range): AlertLevel | null {
  if (value <= r.criticalLow || value >= r.criticalHigh) return "critical";
  if (value < r.low || value > r.high) return "warning";
  return null;
}

export function isNormal(value: number, r: Range) {
  return evaluate(value, r) === null;
}

export function detectAlerts(reading: VitalsReading): Omit<VitalsAlert, "id" | "acknowledged">[] {
  const out: Omit<VitalsAlert, "id" | "acknowledged">[] = [];
  const push = (level: AlertLevel | null, metric: string, value: string, message: string) => {
    if (level) out.push({ level, metric, value, message, at: reading.at });
  };
  push(
    evaluate(reading.heartRate, THRESHOLDS.heartRate),
    "Heart rate",
    `${reading.heartRate} bpm`,
    reading.heartRate > THRESHOLDS.heartRate.high
      ? "Elevated heart rate detected — check for distress or fever."
      : "Low heart rate detected — verify responsiveness.",
  );
  push(
    evaluate(reading.systolic, THRESHOLDS.systolic) ?? evaluate(reading.diastolic, THRESHOLDS.diastolic),
    "Blood pressure",
    `${reading.systolic}/${reading.diastolic} mmHg`,
    reading.systolic > THRESHOLDS.systolic.high
      ? "Blood pressure above safe range — reassess medication timing."
      : "Blood pressure outside safe range — sit resident upright and recheck.",
  );
  push(
    evaluate(reading.spo2, THRESHOLDS.spo2),
    "Oxygen saturation",
    `${reading.spo2}%`,
    "Oxygen saturation below target — check airway and positioning.",
  );
  return out;
}

/** Gentle random walk that occasionally drifts into an alerting range. */
export function nextSimulatedReading(prev: VitalsReading | null): VitalsReading {
  const base: VitalsReading = prev ?? {
    heartRate: 74,
    systolic: 124,
    diastolic: 78,
    spo2: 97,
    at: Date.now(),
  };
  const drift = (v: number, step: number, min: number, max: number) =>
    Math.round(Math.min(max, Math.max(min, v + (Math.random() - 0.5) * step)));

  const spike = Math.random() < 0.06;
  return {
    heartRate: drift(base.heartRate, spike ? 40 : 6, 44, 132),
    systolic: drift(base.systolic, spike ? 40 : 6, 88, 172),
    diastolic: drift(base.diastolic, spike ? 22 : 4, 52, 108),
    spo2: drift(base.spo2, spike ? 8 : 1.4, 88, 100),
    at: Date.now(),
  };
}
