// Mock-first Hardware service: terminals (BLE) + printers.
// Flip to real API with VITE_API_URL and VITE_USE_MOCK=0
import axios from "axios";

const API_URL = import.meta?.env?.VITE_API_URL ?? "";
const USE_MOCK =
  (import.meta?.env?.VITE_USE_MOCK ?? (API_URL ? "0" : "1")) === "1";
const api = API_URL ? axios.create({ baseURL: API_URL }) : null;
const sleep = (ms = 420) => new Promise((r) => setTimeout(r, ms));
const id = (p = "id") => p + Math.random().toString(36).slice(2, 10);

/* ---------------- Mock DB ---------------- */
let terminals = [
  {
    id: "t-001",
    model: "BBPOS WisePad 3",
    serial: "WP3-9A21",
    alias: "Front Desk",
    locationId: "l1",
    status: "online",
    battery: 82,
    firmware: "2.7.1",
    lastSeen: Date.now() - 30_000,
    assigned: true,
  },
  {
    id: "t-002",
    model: "BBPOS WisePad 3",
    serial: "WP3-9B02",
    alias: "Patio",
    locationId: "l1",
    status: "paired",
    battery: 57,
    firmware: "2.7.1",
    lastSeen: Date.now() - 4_000,
    assigned: true,
  },
  {
    id: "t-003",
    model: "BBPOS WisePad 3",
    serial: "WP3-7C11",
    alias: "Spare",
    locationId: null,
    status: "offline",
    battery: 0,
    firmware: "2.6.9",
    lastSeen: Date.now() - 86_400_000,
    assigned: false,
  },
];

let printers = [
  {
    id: "p-001",
    name: "Kitchen-1",
    type: "kitchen",
    iface: "lan",
    address: "192.168.1.60",
    width: 80,
    locationId: "l1",
    status: "online",
    lastSeen: Date.now() - 10_000,
  },
  {
    id: "p-002",
    name: "Receipt-1",
    type: "receipt",
    iface: "ble",
    address: "AA:BB:CC:DD:EE:FF",
    width: 58,
    locationId: "l1",
    status: "online",
    lastSeen: Date.now() - 2_000,
  },
];

/* ---------------- Helpers ---------------- */
const locName = (id) =>
  id === "l1" ? "Soho" : id === "l2" ? "Shoreditch" : "Unassigned";

/* ---------------- Terminals ---------------- */
export async function fetchTerminals(params = { q: "" }) {
  if (USE_MOCK) {
    await sleep();
    const q = params.q?.toLowerCase?.() || "";
    const data = terminals
      .filter((t) =>
        (t.alias + t.serial + t.model + locName(t.locationId))
          .toLowerCase()
          .includes(q)
      )
      .sort(
        (a, b) =>
          (b.status === "online") - (a.status === "online") ||
          b.lastSeen - a.lastSeen
      );
    return { ok: true, data };
  }
  const { data } = await api.get("/hardware/terminals", { params });
  return data;
}

export async function upsertTerminal(payload) {
  if (USE_MOCK) {
    await sleep();
    if (payload.id) {
      terminals = terminals.map((t) =>
        t.id === payload.id ? { ...t, ...payload } : t
      );
      return { ok: true, data: terminals.find((t) => t.id === payload.id) };
    }
    const t = {
      id: id("term-"),
      model: "BBPOS WisePad 3",
      status: "paired",
      battery: 100,
      firmware: "2.7.1",
      lastSeen: Date.now(),
      assigned: !!payload.locationId,
      ...payload,
    };
    terminals = [t, ...terminals];
    return { ok: true, data: t };
  }
  const { data } = await api.post("/hardware/terminals", payload);
  return data;
}

export async function deleteTerminal(idTerm) {
  if (USE_MOCK) {
    await sleep();
    terminals = terminals.filter((t) => t.id !== idTerm);
    return { ok: true };
  }
  const { data } = await api.delete(`/hardware/terminals/${idTerm}`);
  return data;
}

export async function assignTerminal(idTerm, locationId) {
  if (USE_MOCK) {
    await sleep();
    terminals = terminals.map((t) =>
      t.id === idTerm ? { ...t, locationId, assigned: !!locationId } : t
    );
    return { ok: true };
  }
  const { data } = await api.post(`/hardware/terminals/${idTerm}/assign`, {
    locationId,
  });
  return data;
}

export async function pairTerminal(idTerm) {
  if (USE_MOCK) {
    await sleep();
    terminals = terminals.map((t) =>
      t.id === idTerm ? { ...t, status: "paired", lastSeen: Date.now() } : t
    );
    return { ok: true };
  }
  const { data } = await api.post(`/hardware/terminals/${idTerm}/pair`);
  return data;
}

export async function pingTerminal(idTerm) {
  if (USE_MOCK) {
    await sleep();
    terminals = terminals.map((t) =>
      t.id === idTerm
        ? {
            ...t,
            status: "online",
            battery: Math.max(
              10,
              Math.min(100, (t.battery + (Math.random() * 6 - 3)) | 0)
            ),
            lastSeen: Date.now(),
          }
        : t
    );
    return { ok: true, data: terminals.find((t) => t.id === idTerm) };
  }
  const { data } = await api.post(`/hardware/terminals/${idTerm}/ping`);
  return data;
}

/* ---------------- Printers ---------------- */
export async function fetchPrinters(params = { q: "" }) {
  if (USE_MOCK) {
    await sleep();
    const q = params.q?.toLowerCase?.() || "";
    const data = printers
      .filter((p) =>
        (p.name + p.type + p.iface + p.address + locName(p.locationId))
          .toLowerCase()
          .includes(q)
      )
      .sort(
        (a, b) =>
          (b.status === "online") - (a.status === "online") ||
          b.lastSeen - a.lastSeen
      );
    return { ok: true, data };
  }
  const { data } = await api.get("/hardware/printers", { params });
  return data;
}

export async function upsertPrinter(payload) {
  if (USE_MOCK) {
    await sleep();
    if (payload.id) {
      printers = printers.map((p) =>
        p.id === payload.id ? { ...p, ...payload } : p
      );
      return { ok: true, data: printers.find((p) => p.id === payload.id) };
    }
    const p = {
      id: id("pr-"),
      status: "online",
      lastSeen: Date.now(),
      ...payload,
    };
    printers = [p, ...printers];
    return { ok: true, data: p };
  }
  const { data } = await api.post("/hardware/printers", payload);
  return data;
}

export async function deletePrinter(idPrinter) {
  if (USE_MOCK) {
    await sleep();
    printers = printers.filter((p) => p.id !== idPrinter);
    return { ok: true };
  }
  const { data } = await api.delete(`/hardware/printers/${idPrinter}`);
  return data;
}

export async function printTestReceipt(idPrinter) {
  if (USE_MOCK) {
    await sleep(600);
    printers = printers.map((p) =>
      p.id === idPrinter ? { ...p, lastSeen: Date.now(), status: "online" } : p
    );
    return {
      ok: true,
      data: { jobId: id("job-"), message: "Test receipt sent" },
    };
  }
  const { data } = await api.post(`/hardware/printers/${idPrinter}/print-test`);
  return data;
}
