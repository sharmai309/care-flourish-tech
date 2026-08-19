import { useCallback, useEffect, useRef, useState } from "react";

import {
  detectAlerts,
  nextSimulatedReading,
  type ConnectionMode,
  type VitalsAlert,
  type VitalsReading,
} from "./vitals";

const MAX_HISTORY = 40;

function parseHeartRate(value: DataView): number {
  const flags = value.getUint8(0);
  return flags & 0x01 ? value.getUint16(1, true) : value.getUint8(1);
}

function sfloat(value: DataView, offset: number): number {
  const raw = value.getUint16(offset, true);
  let mantissa = raw & 0x0fff;
  let exponent = raw >> 12;
  if (mantissa >= 0x0800) mantissa -= 0x1000;
  if (exponent >= 0x0008) exponent -= 0x0010;
  return mantissa * Math.pow(10, exponent);
}

function parseBloodPressure(value: DataView): { systolic: number; diastolic: number; pulse?: number } {
  const flags = value.getUint8(0);
  const systolic = sfloat(value, 1);
  const diastolic = sfloat(value, 3);
  let offset = 7;
  if (flags & 0x02) offset += 7; // timestamp
  let pulse: number | undefined;
  if (flags & 0x04) pulse = sfloat(value, offset);
  return { systolic: Math.round(systolic), diastolic: Math.round(diastolic), pulse };
}

export function useVitalsMonitor(residentName: string) {
  const [mode, setMode] = useState<ConnectionMode>("offline");
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [reading, setReading] = useState<VitalsReading | null>(null);
  const [history, setHistory] = useState<VitalsReading[]>([]);
  const [alerts, setAlerts] = useState<VitalsAlert[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [bluetoothSupported, setBluetoothSupported] = useState(false);

  const latest = useRef<VitalsReading | null>(null);
  const lastAlertAt = useRef<Record<string, number>>({});
  const deviceRef = useRef<{ gatt?: { disconnect: () => void } } | null>(null);

  useEffect(() => {
    setBluetoothSupported(typeof navigator !== "undefined" && "bluetooth" in navigator);
  }, []);

  const ingest = useCallback(
    (next: VitalsReading) => {
      latest.current = next;
      setReading(next);
      setHistory((h) => [...h, next].slice(-MAX_HISTORY));

      const found = detectAlerts(next);
      if (found.length === 0) return;
      const now = Date.now();
      const fresh = found.filter((a) => now - (lastAlertAt.current[a.metric + a.level] ?? 0) > 20000);
      if (fresh.length === 0) return;
      fresh.forEach((a) => {
        lastAlertAt.current[a.metric + a.level] = now;
      });
      setAlerts((prev) =>
        [
          ...fresh.map((a) => ({
            ...a,
            id: `${a.metric}-${now}-${Math.random().toString(36).slice(2, 7)}`,
            acknowledged: false,
            message: `${residentName}: ${a.message}`,
          })),
          ...prev,
        ].slice(0, 25),
      );
    },
    [residentName],
  );

  // Simulated feed
  useEffect(() => {
    if (mode !== "simulated") return;
    const id = setInterval(() => ingest(nextSimulatedReading(latest.current)), 2000);
    ingest(nextSimulatedReading(latest.current));
    return () => clearInterval(id);
  }, [mode, ingest]);

  const startSimulation = useCallback(() => {
    setError(null);
    setDeviceName("Evergreen Demo Band");
    setMode("simulated");
  }, []);

  const disconnect = useCallback(() => {
    try {
      deviceRef.current?.gatt?.disconnect();
    } catch {
      /* ignore */
    }
    deviceRef.current = null;
    setDeviceName(null);
    setMode("offline");
  }, []);

  const connectBluetooth = useCallback(async () => {
    setError(null);
    const nav = navigator as Navigator & { bluetooth?: any };
    if (!nav.bluetooth) {
      setError("Web Bluetooth isn't available in this browser. Starting the demo feed instead.");
      startSimulation();
      return;
    }
    try {
      const device = await nav.bluetooth.requestDevice({
        filters: [{ services: ["heart_rate"] }, { services: ["blood_pressure"] }],
        optionalServices: ["heart_rate", "blood_pressure", "battery_service"],
      });
      deviceRef.current = device;
      const server = await device.gatt.connect();
      setDeviceName(device.name ?? "Paired monitor");
      setMode("bluetooth");

      try {
        const hrService = await server.getPrimaryService("heart_rate");
        const hrChar = await hrService.getCharacteristic("heart_rate_measurement");
        await hrChar.startNotifications();
        hrChar.addEventListener("characteristicvaluechanged", (e: any) => {
          const hr = parseHeartRate(e.target.value as DataView);
          const prev = latest.current;
          ingest({
            heartRate: hr,
            systolic: prev?.systolic ?? 120,
            diastolic: prev?.diastolic ?? 78,
            spo2: prev?.spo2 ?? 97,
            at: Date.now(),
          });
        });
      } catch {
        /* device may not expose heart rate */
      }

      try {
        const bpService = await server.getPrimaryService("blood_pressure");
        const bpChar = await bpService.getCharacteristic("blood_pressure_measurement");
        await bpChar.startNotifications();
        bpChar.addEventListener("characteristicvaluechanged", (e: any) => {
          const bp = parseBloodPressure(e.target.value as DataView);
          const prev = latest.current;
          ingest({
            heartRate: bp.pulse ?? prev?.heartRate ?? 72,
            systolic: bp.systolic,
            diastolic: bp.diastolic,
            spo2: prev?.spo2 ?? 97,
            at: Date.now(),
          });
        });
      } catch {
        /* device may not expose blood pressure */
      }

      device.addEventListener?.("gattserverdisconnected", () => {
        setMode("offline");
        setDeviceName(null);
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not pair with the device.";
      setError(`${message} Switching to the demo feed so you can preview the workflow.`);
      startSimulation();
    }
  }, [ingest, startSimulation]);

  const acknowledge = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }, []);

  const clearAcknowledged = useCallback(() => {
    setAlerts((prev) => prev.filter((a) => !a.acknowledged));
  }, []);

  return {
    mode,
    deviceName,
    reading,
    history,
    alerts,
    error,
    bluetoothSupported,
    connectBluetooth,
    startSimulation,
    disconnect,
    acknowledge,
    clearAcknowledged,
  };
}
