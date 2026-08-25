const { money } = require('./ledgerMath');

const SCAN_PROMPT = `You read a photo of a handwritten Indian bus operator bill book / daily register (Hindi + English).
Extract amounts in rupees as numbers only (no commas, no Rs).

This company has two buses:
- 7311 = Indore To Gwalior
- 7312 = Gwalior To Indore

Receipt / Aavak fields for a trip (map handwriting variants):
- redbus: Redbus booking / RedBus (this is a cash/booking amount, NOT an API)
- mentis: Mentis / Mantis / Mentis Booking
- indoreOffice: Indore office / Indore booking
- ujjainOffice: Ujjain office
- luggageOffice: Luggage office / Language office / Lugg.

Expense / Kharcha fields for a trip:
- diesel: Diesel
- tollBooth: Toll / Toll booth
- urea: Urea / Uriya / Uriya
- otherItems: everything else on that trip (parking, mala/phool mala, paani/water, body/gate work, bus wash, bhatta, bottle, etc.) as { "note": string, "amount": number }

Office Kharcha (office admin list, NOT the bus trip columns): tire pressure / taire hawa, tea office, evening tea, parking, phool mala, body/gate work, porter/hambali, salary manager, Yuvraj Sir, water, and similar. Use { "title", "amount", "note" }.

Return ONLY JSON with this shape:
{
  "kind": "trip" | "office" | "mixed",
  "date": "YYYY-MM-DD or empty",
  "trips": [
    {
      "busCode": "7311 or 7312 or empty",
      "routeLabel": "Indore To Gwalior or Gwalior To Indore or empty",
      "receipts": { "redbus": 0, "mentis": 0, "indoreOffice": 0, "ujjainOffice": 0, "luggageOffice": 0 },
      "expenses": { "diesel": 0, "tollBooth": 0, "urea": 0, "otherItems": [{ "note": "", "amount": 0 }] }
    }
  ],
  "office": {
    "officeName": "Office Kharcha",
    "items": [{ "title": "", "amount": 0, "note": "" }]
  }
}

Rules:
- If a page has two buses, return two trip objects.
- If a value is missing or unreadable, use 0.
- Do not invent amounts that are not on the page.
- Ignore bleed-through faint writing from the other side unless it is clearly the main ink.
- Map HO / Gwalior office extra income into indoreOffice or ujjainOffice only if the page labels them that way; otherwise put extra income notes into otherItems with negative? NO - extra income goes into the closest office field or luggageOffice. If it is clearly Gwalior office, use indoreOffice only when the trip is Gwalior-related leftover... Prefer putting unlabeled extra booking lines into otherItems NOTE as "income: ..." only if they are expenses. Extra receipts that are not the 5 fields: add to luggageOffice if luggage, else indoreOffice if Indore booking, else skip into receipts.mentis if it looks like a booking portal.
- otherItems and office.items must omit empty rows.`;

function emptyExtracted() {
  return {
    kind: 'unknown',
    date: '',
    trips: [],
    office: { officeName: 'Office Kharcha', items: [] }
  };
}

function num(value) {
  if (typeof value === 'string') {
    const cleaned = value.replace(/[₹,\s]/g, '').replace(/[^\d.-]/g, '');
    return money(cleaned);
  }
  return money(value);
}

function normalizeTrip(trip = {}) {
  const receipts = trip.receipts || {};
  const expenses = trip.expenses || {};
  const otherItems = Array.isArray(expenses.otherItems)
    ? expenses.otherItems
      .map((item) => ({
        note: String(item.note || item.title || '').trim(),
        amount: num(item.amount)
      }))
      .filter((item) => item.note || item.amount)
    : [];
  let busCode = String(trip.busCode || '').replace(/\D/g, '');
  if (busCode.length > 4) busCode = busCode.slice(-4);
  return {
    busCode,
    routeLabel: String(trip.routeLabel || '').trim(),
    receipts: {
      redbus: num(receipts.redbus),
      mentis: num(receipts.mentis),
      indoreOffice: num(receipts.indoreOffice),
      ujjainOffice: num(receipts.ujjainOffice),
      luggageOffice: num(receipts.luggageOffice)
    },
    expenses: {
      diesel: num(expenses.diesel),
      tollBooth: num(expenses.tollBooth),
      urea: num(expenses.urea),
      otherItems
    }
  };
}

function normalizeExtracted(raw = {}) {
  const office = raw.office || {};
  const items = Array.isArray(office.items)
    ? office.items
      .map((item) => ({
        title: String(item.title || item.note || 'Other').trim() || 'Other',
        amount: num(item.amount),
        note: String(item.note || '').trim()
      }))
      .filter((item) => item.amount || item.note || (item.title && item.title !== 'Other'))
    : [];
  const trips = Array.isArray(raw.trips) ? raw.trips.map(normalizeTrip).filter((trip) => {
    const r = trip.receipts;
    const e = trip.expenses;
    return trip.busCode || r.redbus || r.mentis || r.indoreOffice || r.ujjainOffice || r.luggageOffice
      || e.diesel || e.tollBooth || e.urea || e.otherItems.length;
  }) : [];
  let kind = String(raw.kind || '').toLowerCase();
  if (!['trip', 'office', 'mixed'].includes(kind)) {
    kind = trips.length && items.length ? 'mixed' : items.length ? 'office' : trips.length ? 'trip' : 'unknown';
  }
  return {
    kind,
    date: String(raw.date || '').trim(),
    trips,
    office: {
      officeName: String(office.officeName || 'Office Kharcha').trim() || 'Office Kharcha',
      items
    }
  };
}

function parseJsonText(text) {
  if (!text) throw new Error('No text returned from the reader');
  const trimmed = String(text).trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1] : trimmed;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Could not read amounts from this photo');
  return JSON.parse(body.slice(start, end + 1));
}

function visionConfigured() {
  return Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
}

async function scanWithGemini(buffer, mimeType) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const models = [process.env.GEMINI_MODEL || 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError = '';
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: SCAN_PROMPT },
            { inlineData: { mimeType: mimeType || 'image/jpeg', data: buffer.toString('base64') } }
          ]
        }],
        generationConfig: { temperature: 0.1, responseMimeType: 'application/json' }
      })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      lastError = json.error?.message || `Gemini ${res.status}`;
      continue;
    }
    const text = json.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('\n');
    return normalizeExtracted(parseJsonText(text));
  }
  throw new Error(lastError || 'Gemini could not read this bill');
}

async function scanWithOpenAI(buffer, mimeType) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const model = process.env.OPENAI_VISION_MODEL || 'gpt-4o-mini';
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: SCAN_PROMPT },
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${buffer.toString('base64')}` }
          }
        ]
      }]
    })
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error?.message || `OpenAI ${res.status}`);
  return normalizeExtracted(parseJsonText(json.choices?.[0]?.message?.content));
}

async function extractBill(buffer, mimeType) {
  if (process.env.GEMINI_API_KEY) return scanWithGemini(buffer, mimeType);
  if (process.env.OPENAI_API_KEY) return scanWithOpenAI(buffer, mimeType);
  return emptyExtracted();
}

module.exports = { extractBill, visionConfigured, normalizeExtracted, emptyExtracted };
