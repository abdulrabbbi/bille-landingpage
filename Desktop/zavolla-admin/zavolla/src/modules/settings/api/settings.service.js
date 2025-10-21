import axios from "axios";

const API_URL = import.meta?.env?.VITE_API_URL ?? "";
const USE_MOCK =
  (import.meta?.env?.VITE_USE_MOCK ?? (API_URL ? "0" : "1")) === "1";
const api = API_URL ? axios.create({ baseURL: API_URL }) : null;
const sleep = (ms = 420) => new Promise((r) => setTimeout(r, ms));

/** ---------------- Mock store ---------------- */
let SETTINGS = {
  business: {
    name: "Zavolla Demo",
    legalName: "Zavolla LTD",
    email: "owner@zavolla.app",
    phone: "+44 20 7123 4567",
    currency: "GBP",
    timezone: "Europe/London",
  },
  appearance: {
    brandColor: "#16a34a",
    darkBrandColor: "#22d3ee",
    logoUrl: "",
    receiptLogoUrl: "",
  },
  pos: {
    taxPercent: 20,
    serviceChargePercent: 0,
    tippingEnabled: true,
    quickAmounts: [5, 10, 15],
    defaultLocation: "l1",
  },
  security: {
    passcodeRequired: true,
    autoLockMinutes: 5,
    twoFactor: false,
    sessionHours: 24,
  },
  notifications: {
    dailyReportEmail: "owner@zavolla.app",
    dailyReportTime: "18:00",
    pushNewOrder: true,
    pushHardwareAlerts: true,
  },
  receipts: {
    header: "Thanks for dining with us!",
    footer: "VAT No. GB123456789 • Visit again!",
    showTaxBreakdown: true,
    showServiceCharge: true,
    showQrTip: false,
  },
};

export async function getSettings() {
  if (USE_MOCK) {
    await sleep();
    return { ok: true, data: SETTINGS };
  }
  const { data } = await api.get("/settings");
  return data;
}

export async function updateSettings(patch) {
  if (USE_MOCK) {
    await sleep(500);
    SETTINGS = deepMerge(SETTINGS, patch);
    return { ok: true, data: SETTINGS };
  }
  const { data } = await api.put("/settings", patch);
  return data;
}

function deepMerge(target, patch) {
  if (typeof patch !== "object" || patch === null) return patch;
  const out = Array.isArray(target) ? [...target] : { ...target };
  for (const k of Object.keys(patch)) {
    const v = patch[k];
    if (Array.isArray(v)) out[k] = v.slice();
    else if (typeof v === "object" && v)
      out[k] = deepMerge(target?.[k] ?? {}, v);
    else out[k] = v;
  }
  return out;
}
