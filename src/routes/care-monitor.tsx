import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { useVitalsMonitor } from "@/lib/useVitalsMonitor";
import { THRESHOLDS, evaluate, type VitalsReading } from "@/lib/vitals";

export const Route = createFileRoute("/care-monitor")({
  head: () => ({
    meta: [
      { title: "Connected Care Monitor — Evergreen Haven Healthcare" },
      {
        name: "description",
        content:
          "Pair a Bluetooth heart rate and blood pressure monitor, watch a resident's vitals live, and trigger instant alerts to the nurse on duty.",
      },
      { property: "og:title", content: "Connected Care Monitor — Evergreen Haven Healthcare" },
      {
        property: "og:description",
        content:
          "Live vitals from wearable devices with automatic escalation to the assigned nurse.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareMonitorPage,
});

const RESIDENTS = [
  { name: "Eleanor Reyes", room: "Cedar 4", nurse: "Nurse Amara Cole, RN" },
  { name: "Walter Nakamura", room: "Fern 2", nurse: "Nurse Diego Ruiz, LVN" },
];

function statusClasses(level: "critical" | "warning" | null) {
  if (level === "critical") return "border-destructive/40 bg-destructive/10 text-destructive";
  if (level === "warning") return "border-accent/50 bg-accent/10 text-accent";
  return "border-primary/30 bg-primary/5 text-primary";
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return <div className="h-10" />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${34 - ((v - min) / span) * 30}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="h-10 w-full">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function VitalCard({
  label,
  value,
  unit,
  level,
  series,
  range,
}: {
  label: string;
  value: string;
  unit: string;
  level: "critical" | "warning" | null;
  series: number[];
  range: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-colors ${statusClasses(level)} [transform:perspective(900px)_rotateX(2deg)] shadow-sm`}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.18em] opacity-70">{label}</span>
        <span className="text-[10px] uppercase tracking-wider opacity-60">
          {level ?? "stable"}
        </span>
      </div>
      <div className="mt-3 flex items-end gap-1 font-display">
        <span className="text-4xl font-semibold leading-none tabular-nums">{value}</span>
        <span className="pb-1 text-sm opacity-70">{unit}</span>
      </div>
      <Sparkline values={series} />
      <p className="text-[11px] opacity-60">Target {range}</p>
    </div>
  );
}

function CareMonitorPage() {
  const [residentIndex, setResidentIndex] = useState(0);
  const resident = RESIDENTS[residentIndex]!;
  const monitor = useVitalsMonitor(resident.name);
  const { reading, history, alerts } = monitor;

  const series = useMemo(
    () => ({
      hr: history.map((h: VitalsReading) => h.heartRate),
      sys: history.map((h: VitalsReading) => h.systolic),
      spo2: history.map((h: VitalsReading) => h.spo2),
    }),
    [history],
  );

  const openAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
        <Link to="/" className="font-display text-lg font-semibold tracking-tight">
          Evergreen Haven
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">
            Home
          </Link>
          <span
            className={`rounded-full border px-3 py-1 text-xs ${
              monitor.mode === "offline"
                ? "border-border text-muted-foreground"
                : "border-primary/40 bg-primary/10 text-primary"
            }`}
          >
            {monitor.mode === "offline"
              ? "No device"
              : `${monitor.mode === "bluetooth" ? "Bluetooth" : "Demo"} · ${monitor.deviceName}`}
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        <p className="text-xs uppercase tracking-[0.28em] text-accent">Connected care</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Vitals from the wrist to the nurse station, in seconds.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Pair a Bluetooth heart-rate or blood-pressure monitor, or run the demo feed. When a reading
          leaves the safe range, Evergreen Haven escalates it straight to the nurse on duty.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={monitor.connectBluetooth}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Connect device
          </button>
          <button
            onClick={monitor.startSimulation}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
          >
            Start demo feed
          </button>
          {monitor.mode !== "offline" && (
            <button
              onClick={monitor.disconnect}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
            >
              Disconnect
            </button>
          )}
          <select
            value={residentIndex}
            onChange={(e) => setResidentIndex(Number(e.target.value))}
            className="rounded-full border border-border bg-card px-4 py-2.5 text-sm"
            aria-label="Select resident"
          >
            {RESIDENTS.map((r, i) => (
              <option key={r.name} value={i}>
                {r.name} · {r.room}
              </option>
            ))}
          </select>
        </div>

        {!monitor.bluetoothSupported && (
          <p className="mt-4 text-xs text-muted-foreground">
            This browser doesn't expose Web Bluetooth — use Chrome or Edge on desktop/Android for real
            devices. The demo feed works everywhere.
          </p>
        )}
        {monitor.error && <p className="mt-4 text-xs text-accent">{monitor.error}</p>}

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-3">
            <VitalCard
              label="Heart rate"
              value={reading ? String(reading.heartRate) : "—"}
              unit="bpm"
              level={reading ? evaluate(reading.heartRate, THRESHOLDS.heartRate) : null}
              series={series.hr}
              range="50–110 bpm"
            />
            <VitalCard
              label="Blood pressure"
              value={reading ? `${reading.systolic}/${reading.diastolic}` : "—"
              }
              unit="mmHg"
              level={
                reading
                  ? evaluate(reading.systolic, THRESHOLDS.systolic) ??
                    evaluate(reading.diastolic, THRESHOLDS.diastolic)
                  : null
              }
              series={series.sys}
              range="95–145 / 55–92"
            />
            <VitalCard
              label="Oxygen"
              value={reading ? String(reading.spo2) : "—"}
              unit="%"
              level={reading ? evaluate(reading.spo2, THRESHOLDS.spo2) : null}
              series={series.spo2}
              range="93–100%"
            />

            <div className="sm:col-span-3 rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-lg font-semibold">Care context</h2>
              <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Resident</dt>
                  <dd className="mt-1 font-medium">{resident.name}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Suite</dt>
                  <dd className="mt-1 font-medium">{resident.room}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    Assigned nurse
                  </dt>
                  <dd className="mt-1 font-medium">{resident.nurse}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">
                Last reading{" "}
                {reading ? new Date(reading.at).toLocaleTimeString() : "— connect a device to begin"}
              </p>
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Nurse station</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  openAlerts.length
                    ? "bg-destructive/15 text-destructive"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {openAlerts.length ? `${openAlerts.length} open` : "All clear"}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Triggers route to {resident.nurse} the moment a threshold is crossed.
            </p>

            <ul className="mt-5 space-y-3">
              {alerts.length === 0 && (
                <li className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  No alerts yet. Vitals within range are logged silently.
                </li>
              )}
              {alerts.map((a) => (
                <li
                  key={a.id}
                  className={`rounded-xl border p-4 ${
                    a.acknowledged
                      ? "border-border bg-muted/40 opacity-60"
                      : a.level === "critical"
                        ? "border-destructive/40 bg-destructive/10"
                        : "border-accent/40 bg-accent/10"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-wider">
                    <span className="font-medium">
                      {a.level === "critical" ? "Critical" : "Watch"} · {a.metric}
                    </span>
                    <time className="text-muted-foreground">
                      {new Date(a.at).toLocaleTimeString()}
                    </time>
                  </div>
                  <p className="mt-2 text-sm">{a.message}</p>
                  <p className="mt-1 text-sm font-medium tabular-nums">{a.value}</p>
                  {!a.acknowledged ? (
                    <button
                      onClick={() => monitor.acknowledge(a.id)}
                      className="mt-3 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Acknowledge & respond
                    </button>
                  ) : (
                    <p className="mt-3 text-xs text-muted-foreground">Acknowledged by {resident.nurse}</p>
                  )}
                </li>
              ))}
            </ul>

            {alerts.some((a) => a.acknowledged) && (
              <button
                onClick={monitor.clearAcknowledged}
                className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                Clear acknowledged
              </button>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
