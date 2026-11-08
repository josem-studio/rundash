// RunDash · descarga tus actividades de Strava y genera site/data.json
// Se ejecuta en GitHub Actions (Node 22). No hace falta instalar nada.
//
// PRIVACIDAD: este archivo publica solo cifras agregadas (km por día, ritmos, fechas).
// Nunca incluye nombres de actividades, ubicaciones, rutas GPS ni horas.

import { mkdir, writeFile } from "node:fs/promises";

// ================= CONFIGURA AQUÍ =================
const TZ = "Europe/Madrid";
const GOAL = { name: "Maratón de Barcelona", date: "2027-03-14" };
const PEAK_KM = 58;             // km/semana máximos que quieres alcanzar antes del tapering
const MAX_STEP = 0.10;          // subida máxima por semana (10 %)
const MIN_STEP = 2;             // km mínimos que sube cada semana de carga (para ir sumando siempre)
const CUTBACK_EVERY = 4;        // cada 4.ª semana, semana de descarga (-20 %)
const TAPER = [0.8, 0.6, 0.35]; // últimas 3 semanas (la última es la de la carrera), como fracción del pico
const MIN_BASE = 12;            // base mínima (km/semana) para calcular el plan
// ==================================================

const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } = process.env;
if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
  console.error("::error::Faltan los secretos STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET o STRAVA_REFRESH_TOKEN en GitHub.");
  process.exit(1);
}

// ---------- fechas (todo con claves "YYYY-MM-DD", sin líos de zona horaria) ----------
const now = process.env.TODAY ? new Date(process.env.TODAY + "T12:00:00Z") : new Date(); // TODAY solo para pruebas
const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const todayKey = dayFmt.format(now);
const parseKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const addDays = (k, n) => { const d = parseKey(k); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const mondayOf = (k) => addDays(k, -((parseKey(k).getUTCDay() + 6) % 7));
const diffDays = (a, b) => Math.round((parseKey(a) - parseKey(b)) / 86400000);

// ---------- Strava ----------
async function getAccessToken() {
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: STRAVA_REFRESH_TOKEN,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    console.error("::error::Strava rechazó el token (HTTP " + res.status + "). Repite la autorización y actualiza el secreto STRAVA_REFRESH_TOKEN.");
    process.exit(1);
  }
  if (json.refresh_token && json.refresh_token !== STRAVA_REFRESH_TOKEN) {
    console.warn("::warning::Strava ha cambiado el refresh token. Si la próxima ejecución falla, actualiza el secreto STRAVA_REFRESH_TOKEN.");
  }
  return json.access_token;
}

async function getActivities(token, sinceKey) {
  const after = Math.floor(parseKey(sinceKey).getTime() / 1000);
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=200&page=${page}`, {
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) {
      console.error("::error::Error pidiendo actividades a Strava: HTTP " + res.status);
      process.exit(1);
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 200) break;
  }
  return all;
}

// ---------- plan adaptativo ----------
// Parte de tu media real de las últimas semanas completadas y sube cada semana (siempre suma),
// con una semana de descarga cada 4 y 3 semanas de tapering. Se recalcula en cada ejecución.
function makePlan(weekStart, goalDate, base) {
  const n = diffDays(mondayOf(goalDate), weekStart) / 7 + 1; // semanas hasta la de la carrera, incluidas
  if (n < 1) return { plan: [], progressive: 0, top: base, weeksToRace: -1 };
  const plan = [];
  let level = Math.max(base, MIN_BASE), top = level, progressive = 0;
  for (let k = 0; k < n; k++) {
    const fromEnd = n - 1 - k; // 0 = semana de la carrera
    let target;
    if (fromEnd < TAPER.length) target = Math.round(top * TAPER[TAPER.length - 1 - fromEnd]);
    else if ((k + 1) % CUTBACK_EVERY === 0 && fromEnd > TAPER.length) target = Math.round(level * 0.8); // sin descarga justo antes del tapering
    else {
      level = Math.min(PEAK_KM, Math.max(level + MIN_STEP, Math.round(level * (1 + MAX_STEP))));
      target = Math.round(level); top = Math.max(top, level); progressive++;
    }
    plan.push([addDays(weekStart, 7 * k), target]);
  }
  return { plan, progressive, top, weeksToRace: n - 1 };
}

// ---------- cálculo ----------
const token = await getAccessToken();
const acts = await getActivities(token, addDays(todayKey, -1100));
const dateOf = (a) => (a.start_date_local || a.start_date).slice(0, 10);
const isRun = (a) => ["Run", "TrailRun", "VirtualRun"].includes(a.sport_type || a.type);
const runs = acts.filter(isRun).map((a) => ({
  date: dateOf(a),
  km: a.distance / 1000,
  sec: a.moving_time,
  effort: typeof a.suffer_score === "number" ? a.suffer_score : null,
  race: a.workout_type === 1,
})).filter((r) => r.km > 0.3).sort((a, b) => a.date.localeCompare(b.date));

const r1 = (n) => Math.round(n * 10) / 10;
const paceOf = (list) => {
  const km = list.reduce((s, r) => s + r.km, 0);
  const sec = list.reduce((s, r) => s + r.sec, 0);
  return km > 0 ? Math.round(sec / km) : null;
};

// semana actual (lunes a domingo)
const weekStart = mondayOf(todayKey);
const days = [];
for (let i = 0; i < 7; i++) {
  const date = addDays(weekStart, i);
  const list = runs.filter((r) => r.date === date);
  days.push({ date, km: r1(list.reduce((s, r) => s + r.km, 0)), runs: list.length, pace: paceOf(list) });
}
const weekKm = r1(days.reduce((s, d) => s + d.km, 0));

// km por semana (últimas 12 semanas cerradas + la actual)
const weekly = [];
for (let i = 12; i >= 0; i--) {
  const start = addDays(weekStart, -7 * i);
  const end = addDays(start, 6);
  weekly.push({ start, km: r1(runs.filter((r) => r.date >= start && r.date <= end).reduce((s, r) => s + r.km, 0)) });
}

// base = media de las últimas 4 semanas completadas (no incluye la actual: el objetivo no cambia durante la semana)
const done = weekly.filter((w) => w.start < weekStart).slice(-4);
const base = done.length ? done.reduce((s, w) => s + w.km, 0) / done.length : 0;
const { plan, progressive, top, weeksToRace } = makePlan(weekStart, GOAL.date, base);
const target = plan.length ? plan[0][1] : Math.round(Math.max(base, MIN_BASE));

// trayectoria hacia el pico: ¿puedes llegar subiendo como máximo un 10 % por semana?
const reachable = Math.min(PEAK_KM, Math.round(Math.max(base, MIN_BASE) * Math.pow(1 + MAX_STEP, progressive)));
const floor = progressive > 0 ? Math.ceil(PEAK_KM / Math.pow(1 + MAX_STEP, progressive)) : PEAK_KM;
const status = reachable >= PEAK_KM * 0.98 ? "ok" : reachable >= PEAK_KM * 0.85 ? "behind" : "risk";

// racha semanal (cualquier actividad, como hace Strava)
const weeksWithActivity = new Set(acts.map((a) => mondayOf(dateOf(a))));
let cursor = weeksWithActivity.has(weekStart) ? weekStart : addDays(weekStart, -7);
let streak = 0;
while (weeksWithActivity.has(cursor)) { streak++; cursor = addDays(cursor, -7); }

// estadísticas
const since180 = addDays(todayKey, -180);
const runs180 = runs.filter((r) => r.date >= since180);
const last28 = runs.filter((r) => diffDays(todayKey, r.date) < 28);
const prev28 = runs.filter((r) => { const d = diffDays(todayKey, r.date); return d >= 28 && d < 56; });

// predicción de maratón (Riegel) a partir de la mejor carrera oficial reciente
let prediction = null;
for (const r of runs180.filter((x) => x.race && x.km >= 5)) {
  const marathonSec = r.sec * Math.pow(42.195 / r.km, 1.06);
  if (!prediction || marathonSec < prediction.marathon_sec) {
    prediction = { from_km: r1(r.km), marathon_sec: Math.round(marathonSec), pace_sec: Math.round(marathonSec / 42.195) };
  }
}

const last = runs.length ? runs[runs.length - 1] : null;
const data = {
  generated_at: now.toISOString(),
  today: todayKey,
  goal: GOAL,
  plan,
  week: { start: weekStart, target, km: weekKm, days },
  trajectory: {
    base: r1(base), peak: PEAK_KM, planned_peak: Math.round(top), reachable, floor, status,
    progressive_weeks: progressive, weeks_to_race: weeksToRace, next_target: plan.length > 1 ? plan[1][1] : null,
  },
  weekly_km: weekly,
  streak_weeks: streak,
  last_activity: last && {
    date: last.date, km: r1(last.km), sec: last.sec, pace_sec: Math.round(last.sec / last.km), effort: last.effort,
  },
  stats: {
    km_180d: r1(runs180.reduce((s, r) => s + r.km, 0)),
    runs_180d: runs180.length,
    longest_km: r1(Math.max(0, ...runs180.map((r) => r.km))),
    pace_28d: paceOf(last28),
    pace_prev_28d: paceOf(prev28),
    avg_minutes_28d: last28.length ? Math.round(last28.reduce((s, r) => s + r.sec, 0) / last28.length / 60) : null,
  },
  prediction,
};

await mkdir("site", { recursive: true });
await writeFile("site/data.json", JSON.stringify(data, null, 1));
console.log("OK · datos generados"); // el registro de Actions es público: no imprimimos cifras
