/* Dabyll.kz прототипі. Барлық экрандар hash-маршрутпен ауысады: #/, #/komek, #/sos ... */

const HOTLINE = "4143"; // Dabyll сервисінің шартты (прототип) нөмірі

const BANKS = [
  { id: "kaspi", name: "Kaspi.kz", phone: "9999" },
  { id: "halyk", name: "Halyk Bank", phone: "7111" },
  { id: "jusan", name: "Jusan Bank", phone: "7711" },
  { id: "bcc", name: "BCC (ЦентрКредит)", phone: "505" },
];

const TEMPLATES = [
  {
    id: "t1",
    needsName: true,
    preview: "[СІЗДІҢ АТЫ-ЖӨНІҢІЗ] атынан алаяқтық әрекеттер байқалды. Сізге оның атынан ақша немесе жеке деректер сұрап хабарласса, дереу қоңырауды үзіп, оған тікелей өзіне хабарласыңыз.",
    build: (name) => `НАЗАР АУДАРЫҢЫЗ! ${name || "[СІЗДІҢ АТЫ-ЖӨНІҢІЗ]"} атынан алаяқтық әрекеттер байқалды. Сізге оның атынан ақша немесе жеке деректер сұрап хабарласса, дереу қоңырауды үзіп, оған тікелей өзіне хабарласыңыз.`,
  },
  {
    id: "t2",
    preview: "Менің желілерім (WhatsApp) немесе нөмірім бұзылған болуы мүмкін. Менен келген кез келген ақша сұрау немесе код сұрау туралы хабарламаларға ИЛАНБАҢЫЗ!",
    build: () => "Менің желілерім (WhatsApp) немесе нөмірім бұзылған болуы мүмкін. Менен келген кез келген ақша сұрау немесе код сұрау туралы хабарламаларға ИЛАНБАҢЫЗ!",
  },
  {
    id: "t3",
    preview: "НАЗАР АУДАРЫҢЫЗ! Менің атымнан кибершабуыл жасалып жатыр. Менің атымнан ақша сұраса немесе күмәнді сілтеме жіберілсе, сенбеңіз! Алаяқтардан сақтаныңыз.",
    build: () => "НАЗАР АУДАРЫҢЫЗ! Менің атымнан кибершабуыл жасалып жатыр. Менің атымнан ақша сұраса немесе күмәнді сілтеме жіберілсе, сенбеңіз! Алаяқтардан сақтаныңыз.",
  },
];

const GUIDE = [
  {
    id: "1",
    title: "«Банк қызметкері» болып қоңырау шалу",
    text: "Алаяқ өзін банктің қауіпсіздік қызметкері деп таныстырып, атыңызға бейтаныс біреулер несие рәсімдеп жатқанын хабарлайды. Ол үрей туғызу арқылы шұғыл шешім қабылдауға мәжбүрлейді. Сондай-ақ алаяқтықты тоқтату үшін «қарсы несие» алуды, ақшаны «қауіпсіз шотқа» аударуды немесе SMS-пен келген құпия кодты айтуды талап етеді. Деректерді алғаннан кейін ақшаны қолды қылып, байланысты өшіреді.",
    todo: "Қоңырауды үзіңіз. Банкке картаның артындағы нөмір бойынша өзіңіз қоңырау шалыңыз. Нағыз банк ешқашан SMS-кодты сұрамайды және ақшаны «қауіпсіз шотқа» аударуды өтінбейді.",
  },
  {
    id: "2",
    title: "1414 және eGov атын жамылу",
    text: "Алаяқ 1414 немесе eGov қызметінің атынан хабарласып, құжатыңыздың мерзімі өтіп жатқанын немесе сізге төлем тағайындалғанын айтады. Оны рәсімдеу үшін SMS арқылы келген кодты айтуды немесе жалған сілтемеге өтіп, ЭЦҚ мен құпиясөзді енгізуді сұрайды. Код пен ЭЦҚ қолына түскен соң алаяқ сіздің атыңыздан мемлекеттік және банк қызметтеріне кіріп, несие рәсімдей алады.",
    todo: "Мемлекеттік қызметтер телефон арқылы SMS-код пен ЭЦҚ құпиясөзін сұрамайды. Қоңырауды үзіп, 1414 нөміріне өзіңіз хабарласыңыз. eGov сайтын тек egov.kz мекенжайы арқылы ашыңыз.",
  },
  {
    id: "3",
    title: "«Карта бұғатталды» хабарламасы",
    text: "Сізге SMS немесе мессенджер арқылы «Картаңыз бұғатталды, қалпына келтіру үшін сілтемеге өтіңіз» деген хабарлама келеді. Сілтеме банк сайтына өте ұқсас жалған бетті ашады. Онда карта нөмірін, CVV кодын және SMS-кодты енгізу сұралады. Осы деректерді енгізген сәтте алаяқ картадағы ақшаны шешіп алады.",
    todo: "Хабарламадағы сілтемеге баспаңыз. Картаның жағдайын банктің ресми қосымшасынан немесе картаның артындағы нөмір арқылы тексеріңіз.",
  },
  {
    id: "4",
    title: "Deepfake және AI-алаяқтық",
    text: "Алаяқтар жасанды интеллект көмегімен туысыңыздың немесе танысыңыздың дауысын, тіпті бейнесін жасай алады. Олар «апатқа түстім», «шұғыл ақша керек» деген дауыстық хабарлама немесе бейнеқоңырау жібереді. Дауыс таныс естілгендіктен адам тексермей ақша аударып жібереді.",
    todo: "Ақша аудармас бұрын сол адамның өз нөміріне қайта қоңырау шалыңыз. Отбасыңызбен тек өздеріңіз білетін құпия сөз келісіп алыңыз да, күмәнді жағдайда соны сұраңыз.",
  },
];

const DEFAULT_CONTACTS = [
  { name: "Берік досым", phone: "" },
  { name: "Анашым", phone: "" },
  { name: "Самат көрші", phone: "" },
  { name: "Басеке", phone: "" },
];

/* ---------- state ---------- */
const state = {
  templateId: load("dabyll.template", "t1"),
  userName: load("dabyll.name", ""),
  contacts: load("dabyll.contacts", DEFAULT_CONTACTS),
  block: { bank: null, cardNumber: "", cvv: "", expiry: "", iin: "", reason: "lost" },
  chat: [],
};

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? structuredClone(fallback) : JSON.parse(v);
  } catch { return structuredClone(fallback); }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
}

/* ---------- helpers ---------- */
const app = document.getElementById("app");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function frame(title, inner, backTo) {
  const back = backTo ? `<a class="back" href="${backTo}">← Артқа</a>` : "";
  return `<h1 class="frame-title">${esc(title)}</h1>${back}${inner}`;
}

function toast(text) {
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = text; t.setAttribute("role", "status");
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

/* Қазақстан нөмірін WhatsApp/SMS форматына келтіру: 8 777 ... -> 7777... */
function normalizePhone(raw) {
  let d = String(raw).replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("8")) d = "7" + d.slice(1);
  if (d.length === 10) d = "7" + d;
  return d.length === 11 && d.startsWith("7") ? d : null;
}
function digitsOnly(value, limit) {
  return String(value).replace(/\D/g, "").slice(0, limit);
}
function formatCard(value) {
  return digitsOnly(value, 16).replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}
function formatExpiry(value) {
  const d = digitsOnly(value, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
function validExpiry(value) {
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return false;
  const month = Number(m[1]);
  return month >= 1 && month <= 12;
}
function maskCard(value) {
  const d = digitsOnly(value, 16);
  return d.length >= 4 ? `•••• •••• •••• ${d.slice(-4)}` : "••••";
}
function maskIin(value) {
  const d = digitsOnly(value, 12);
  return d.length >= 4 ? `••••••••${d.slice(-4)}` : "••••";
}

/* ---------- screens ---------- */
function renderHome() {
  app.innerHTML = frame("Басты бет", `
    <nav class="tiles" aria-label="Негізгі функциялар">
      ${tile("#/komek", "phone", "Шұғыл көмек")}
      ${tile("#/sos", "sos", "SOS-Ескерту", '<span class="tile-badge">SMS</span>')}
      ${tile("#/block", "block", "Жедел бұғаттау")}
      ${tile("#/ai", "ai", "Ai-жәрдем", '<span class="tile-badge ai">Ai</span>')}
      ${tile("#/guide", "guide", "Қауіпсіздік гиді", "", "wide")}
    </nav>`);
}
function tile(href, icon, label, badge = "", extra = "") {
  return `<a class="tile ${extra}" href="${href}">
    <span class="tile-icon"><img src="icons/${icon}.jpg" alt="">${badge}</span>
    <span class="tile-label">${label}</span></a>`;
}

function panel(icon, body, alt = "") {
  return `<section class="panel"><div class="panel-icon"><img src="icons/${icon}.jpg" alt="${alt}"></div>
    <div class="panel-body">${body}</div></section>`;
}

function renderKomek() {
  app.innerHTML = frame("Шұғыл көмек", panel("phone", `
    <button class="hotline" id="callBtn"><u>${HOTLINE}</u> - қоңырау шалу 📞</button>
    <p>Алаяққа код айтып қойсаңыз, ақша аударып жіберсеңіз немесе күмәнді қоңырау келсе, Dabyll желісіне хабарласыңыз.</p>
    <p class="safe-note">Қауіп төнсе, полиция: 102</p>
  `), "#/");
  document.getElementById("callBtn").addEventListener("click", startCall);
}

/* SOS қадам 1: үлгіні таңдау */
function renderSos() {
  const t = TEMPLATES.find((x) => x.id === state.templateId) || TEMPLATES[0];
  app.innerHTML = frame("SOS-Ескерту", `
    <p class="sos-head">Төмендегі хабарламалардың бірін таңдап, контактілерді енгізіңіз:</p>
    <div class="sos-grid">
      <div class="sos-side"><img src="icons/sos.jpg" alt=""><p>Хабарлама үлгілері:</p></div>
      <div>
        <div class="templates" role="group" aria-label="Хабарлама үлгілері">
          ${TEMPLATES.map((x) => `<button class="template" data-id="${x.id}" aria-pressed="${x.id === t.id}">${esc(x.preview)}</button>`).join("")}
        </div>
        <div class="field" id="nameField" style="margin-top:18px" ${t.needsName ? "" : "hidden"}>
          <label for="userName">Аты-жөніңіз</label>
          <input id="userName" value="${esc(state.userName)}" placeholder="Мысалы: Болат Есенов" autocomplete="name">
          <small>Бірінші үлгідегі [СІЗДІҢ АТЫ-ЖӨНІҢІЗ] орнына қойылады</small>
        </div>
        <div class="row-end"><a class="btn btn-green" href="#/sos/contacts">Контактілерді таңдау</a></div>
      </div>
    </div>`, "#/");

  app.querySelectorAll(".template").forEach((b) => b.addEventListener("click", () => {
    state.templateId = b.dataset.id; save("dabyll.template", state.templateId);
    app.querySelectorAll(".template").forEach((x) => x.setAttribute("aria-pressed", x === b));
    const needs = TEMPLATES.find((x) => x.id === b.dataset.id).needsName;
    document.getElementById("nameField").hidden = !needs;
  }));
  document.getElementById("userName").addEventListener("input", (e) => {
    state.userName = e.target.value.trim(); save("dabyll.name", state.userName);
  });
}

function currentMessage() {
  const t = TEMPLATES.find((x) => x.id === state.templateId) || TEMPLATES[0];
  return t.build(state.userName);
}

/* SOS қадам 2: контактілер және жіберу */
function renderSosContacts() {
  const msg = currentMessage();
  app.innerHTML = frame("SOS-Ескерту", `
    <div class="contacts-wrap">
      <section class="contacts" aria-label="Таңдалған контактілер">
        <h2>Таңдалған контактлер:</h2>
        <div id="contactList"></div>
        <form class="add-contact" id="addForm">
          <input id="newName" placeholder="Аты" aria-label="Контакт аты" required>
          <input id="newPhone" placeholder="Нөмірі" inputmode="tel" aria-label="Телефон нөмірі">
          <button type="submit" aria-label="Тағы қосу" title="Тағы қосу">+</button>
        </form>
      </section>
      <div>
        <div class="bubble"><h3>${HOTLINE}</h3><p>${esc(msg)}</p></div>
        <p class="hint">Әр контактінің жанындағы батырма WhatsApp немесе SMS қосымшасын дайын мәтінмен ашады. Жіберуді өзіңіз растайсыз.</p>
        <div class="row-end"><a class="btn" href="#/sos">Үлгіні өзгерту</a></div>
      </div>
    </div>`, "#/sos");
  drawContacts(msg);

  document.getElementById("addForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("newName").value.trim();
    const phone = document.getElementById("newPhone").value.trim();
    if (!name) return;
    state.contacts.push({ name, phone });
    save("dabyll.contacts", state.contacts);
    e.target.reset();
    drawContacts(msg);
  });
}

function drawContacts(msg) {
  const list = document.getElementById("contactList");
  if (!state.contacts.length) {
    list.innerHTML = `<p style="padding:16px;margin:0;font-weight:600">Контакт жоқ. Төменнен аты мен нөмірін қосыңыз.</p>`;
    return;
  }
  const text = encodeURIComponent(msg);
  list.innerHTML = state.contacts.map((c, i) => {
    const n = normalizePhone(c.phone);
    const dis = n ? "" : 'aria-disabled="true" tabindex="-1" style="opacity:.4;pointer-events:none"';
    return `<div class="contact">
      <button class="contact-remove" data-i="${i}" aria-label="${esc(c.name)} өшіру" title="Өшіру">−</button>
      <div>
        <div class="contact-name">${esc(c.name)}</div>
        <input class="contact-phone ${c.phone && !n ? "bad" : ""}" data-i="${i}" value="${esc(c.phone)}" placeholder="+7 7__ ___ __ __" inputmode="tel" aria-label="${esc(c.name)} нөмірі">
        <div class="contact-send">
          <a class="btn btn-sm btn-green" ${dis} target="_blank" rel="noopener" href="${n ? `https://wa.me/${n}?text=${text}` : "#"}">WhatsApp</a>
          <a class="btn btn-sm" ${dis} href="${n ? `sms:+${n}?body=${text}` : "#"}">SMS</a>
        </div>
      </div></div>`;
  }).join("");

  list.querySelectorAll(".contact-remove").forEach((b) => b.addEventListener("click", () => {
    state.contacts.splice(Number(b.dataset.i), 1);
    save("dabyll.contacts", state.contacts);
    drawContacts(msg);
  }));
  list.querySelectorAll(".contact-phone").forEach((inp) => inp.addEventListener("input", () => {
    const index = Number(inp.dataset.i);
    state.contacts[index].phone = inp.value.trim();
    save("dabyll.contacts", state.contacts);
    updateContactSend(inp.closest(".contact"), state.contacts[index], msg);
  }));
}

function updateContactSend(contact, contactData, msg) {
  const n = normalizePhone(contactData.phone);
  const text = encodeURIComponent(msg);
  const input = contact.querySelector(".contact-phone");
  const [whatsapp, sms] = contact.querySelectorAll(".contact-send a");
  input.classList.toggle("bad", Boolean(contactData.phone && !n));
  [
    [whatsapp, n ? `https://wa.me/${n}?text=${text}` : "#"],
    [sms, n ? `sms:+${n}?body=${text}` : "#"],
  ].forEach(([link, href]) => {
    link.href = href;
    if (n) {
      link.removeAttribute("aria-disabled");
      link.removeAttribute("tabindex");
      link.removeAttribute("style");
    } else {
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("tabindex", "-1");
      link.setAttribute("style", "opacity:.4;pointer-events:none");
    }
  });
}

/* Жедел бұғаттау */
function renderBlock() {
  app.innerHTML = frame("Жедел бұғаттау", panel("block", `
    <a class="choice" href="#/block/card">Карта және деректерді бұғаттау</a>
    <a class="choice" href="#/block/banks">Банкке қоңырау шалу</a>
  `), "#/");
}

function renderBlockBanks() {
  app.innerHTML = frame("Банкке қоңырау шалу", panel("block", `
    <ul class="bank-list">
      ${BANKS.map((b) => `<li><a href="tel:${b.phone}">${esc(b.name)}: ${b.phone}</a></li>`).join("")}
    </ul>
    <p class="safe-note">Нөмірді өзіңіз теріңіз. Картаның артындағы нөмір де ресми нөмір болып саналады.</p>
  `), "#/block");
}

function renderBlockCard() {
  const s = state.block;
  app.innerHTML = frame("Карта және деректерді бұғаттау", panel("block", `
    <p class="safe-note">Демо режим: бұл деректер тек осы экрандағы прототип үшін қолданылады, серверге жіберілмейді және браузер жадында сақталмайды. PIN-код пен SMS-кодты ешқашан енгізбеңіз.</p>
    <div class="field"><span>Банкті таңдаңыз</span>
      <div class="banks" role="group" aria-label="Банк">
        ${BANKS.map((b) => `<button type="button" class="bank" data-id="${b.id}" aria-pressed="${s.bank === b.id}">${esc(b.name)}</button>`).join("")}
      </div>
    </div>
    <div class="field">
      <label for="cardNumber">Карта нөмірі</label>
      <input id="cardNumber" inputmode="numeric" maxlength="19" autocomplete="off" value="${esc(formatCard(s.cardNumber))}" placeholder="0000 0000 0000 0000">
    </div>
    <div class="block-fields">
      <div class="field">
        <label for="expiry">Жарамдылық мерзімі</label>
        <input id="expiry" inputmode="numeric" maxlength="5" autocomplete="off" value="${esc(s.expiry)}" placeholder="MM/YY">
      </div>
      <div class="field">
        <label for="cvv">CVV</label>
        <input id="cvv" inputmode="numeric" maxlength="3" autocomplete="off" value="${esc(s.cvv)}" placeholder="000">
      </div>
    </div>
    <div class="field">
      <label for="iin">ЖСН / ИИН</label>
      <input id="iin" inputmode="numeric" maxlength="12" autocomplete="off" value="${esc(s.iin)}" placeholder="000000000000">
    </div>
    <fieldset class="field reasons" style="border:0;padding:0;margin:0">
      <legend style="margin-bottom:6px">Не болды?</legend>
      ${[["lost", "Карта жоғалды немесе ұрланды"], ["code", "Алаяққа код немесе деректерді айтып қойдым"], ["tx", "Мен жасамаған операция көрдім"]]
        .map(([v, l]) => `<label><input type="radio" name="reason" value="${v}" ${s.reason === v ? "checked" : ""}> ${l}</label>`).join("")}
    </fieldset>
    <div><button class="btn btn-alarm" id="blockGo">Бұғаттау нұсқаулығын алу</button></div>
  `), "#/block");

  const go = document.getElementById("blockGo");
  const sync = () => {
    go.disabled = !(s.bank && digitsOnly(s.cardNumber, 16).length === 16 && /^\d{3}$/.test(s.cvv) && validExpiry(s.expiry) && digitsOnly(s.iin, 12).length === 12);
  };
  app.querySelectorAll(".bank").forEach((b) => b.addEventListener("click", () => {
    s.bank = b.dataset.id;
    app.querySelectorAll(".bank").forEach((x) => x.setAttribute("aria-pressed", x === b));
    sync();
  }));
  document.getElementById("cardNumber").addEventListener("input", (e) => {
    e.target.value = formatCard(e.target.value);
    s.cardNumber = e.target.value;
    sync();
  });
  document.getElementById("expiry").addEventListener("input", (e) => {
    e.target.value = formatExpiry(e.target.value);
    s.expiry = e.target.value;
    sync();
  });
  document.getElementById("cvv").addEventListener("input", (e) => {
    e.target.value = digitsOnly(e.target.value, 3);
    s.cvv = e.target.value;
    sync();
  });
  document.getElementById("iin").addEventListener("input", (e) => {
    e.target.value = digitsOnly(e.target.value, 12);
    s.iin = e.target.value;
    sync();
  });
  app.querySelectorAll('input[name="reason"]').forEach((r) => r.addEventListener("change", () => { s.reason = r.value; }));
  go.addEventListener("click", () => { location.hash = "#/block/result"; });
  sync();
}

function renderBlockResult() {
  const s = state.block;
  const bank = BANKS.find((b) => b.id === s.bank);
  if (!bank || digitsOnly(s.cardNumber, 16).length !== 16 || !/^\d{3}$/.test(s.cvv) || !validExpiry(s.expiry) || digitsOnly(s.iin, 12).length !== 12) { location.hash = "#/block/card"; return; }
  const extra = {
    lost: "Картаны қайта шығаруды банк қосымшасынан немесе бөлімшеден сұраңыз.",
    code: "Банк қосымшасының құпиясөзін ауыстырыңыз және 102 нөміріне хабарласып, полицияға арыз беріңіз.",
    tx: "Банкке операцияға дау айту (опротестование) туралы өтініш беріңіз, скриншоттарды сақтап қойыңыз.",
  }[s.reason];
  app.innerHTML = frame("Бұғаттау нұсқаулығы", panel("block", `
    <span class="card-chip">${esc(bank.name)} ${esc(maskCard(s.cardNumber))} · ${esc(s.expiry)} · CVV *** · ЖСН ${esc(maskIin(s.iin))}</span>
    <ol class="steps">
      <li>${esc(bank.name)} қосымшасын ашып, картаны таңдаңыз да, «Бұғаттау» батырмасын басыңыз.</li>
      <li>Қосымшаға кіре алмасаңыз, банкке қоңырау шалыңыз: <a href="tel:${bank.phone}"><strong>${bank.phone}</strong></a>. Операторға деректерді тек ресми арнада айтыңыз.</li>
      <li>${esc(extra)}</li>
    </ol>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <a class="btn btn-alarm" href="tel:${bank.phone}">${esc(bank.name)}: ${bank.phone} қоңырау шалу</a>
      <a class="btn" href="#/">Басты бет</a>
    </div>
  `), "#/block/card");
}

/* Ai-жәрдем */
const CHIPS = [
  "Маған жаңа ғана банктен қоңырау шалды…",
  "1414-тен код сұрап SMS келді",
  "Туысым WhatsApp-та ақша сұрап жатыр",
  "Картам бұғатталды деген сілтеме келді",
];

function renderAi() {
  if (!state.chat.length) state.chat.push({ role: "assistant", content: "Қайырлы күн! Айтыңызшы, сізге қандай көмек көрсете аламын?!" });
  app.innerHTML = frame("Ai-жәрдем", `
    <div class="chat">
      <div class="chat-avatar"><img src="icons/ai.jpg" alt=""><span>Ai</span></div>
      <div class="chat-main">
        <div class="messages" id="messages" aria-live="polite"></div>
        <div class="chips">${CHIPS.map((c) => `<button class="chip">${esc(c)}</button>`).join("")}</div>
        <form class="composer" id="composer">
          <textarea id="chatInput" rows="2" placeholder="Жағдайды жазыңыз…" aria-label="Хабарлама"></textarea>
          <button class="btn btn-alarm" id="sendBtn" type="submit">Жіберу</button>
        </form>
        <p class="mode-note" id="modeNote">Ai-жәрдемге карта нөмірін, CVV немесе SMS-кодты жазбаңыз.</p>
      </div>
    </div>`, "#/");
  drawMessages();
  const input = document.getElementById("chatInput");
  document.getElementById("composer").addEventListener("submit", (e) => { e.preventDefault(); sendChat(input.value); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(input.value); }
  });
  app.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => sendChat(c.textContent)));
  input.focus();
}

function drawMessages(typing = false) {
  const box = document.getElementById("messages");
  if (!box) return;
  box.innerHTML = state.chat.map((m) => `<div class="msg ${m.role === "user" ? "user" : "bot"}">${esc(m.content)}</div>`).join("")
    + (typing ? `<div class="msg bot typing">Ai жазып жатыр…</div>` : "");
  box.scrollTop = box.scrollHeight;
}

let chatBusy = false;
async function sendChat(text) {
  text = (text || "").trim();
  if (!text || chatBusy) return;
  chatBusy = true;
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  if (input) input.value = "";
  if (sendBtn) sendBtn.disabled = true;
  state.chat.push({ role: "user", content: text.slice(0, 2000) });
  drawMessages(true);

  let reply;
  try {
    const history = state.chat.slice(1).slice(-12); // алғашқы сәлемдесуді жібермейміз
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!data.reply) throw new Error("empty");
    reply = data.reply;
  } catch (err) {
    console.warn("AI API қолжетімсіз, офлайн жауап:", err);
    reply = offlineReply(text);
    const note = document.getElementById("modeNote");
    if (note) note.textContent = "Желі жоқ: Ai-жәрдем қазір дайын жауаптар режимінде жұмыс істеп тұр.";
  }
  state.chat.push({ role: "assistant", content: reply });
  chatBusy = false;
  drawMessages();
  if (sendBtn) sendBtn.disabled = false;
}

/* Интернет немесе API жоқ кездегі қосалқы жауаптар */
function offlineReply(text) {
  const t = text.toLowerCase();
  const has = (...w) => w.some((x) => t.includes(x));
  if (has("1414", "egov", "эцп", "эцқ", "егов", "госуслуг"))
    return "Бұл 1414 немесе eGov атын жамылған алаяқтыққа ұқсайды.\n\n1. Ешкімге SMS-код пен ЭЦҚ құпиясөзін айтпаңыз.\n2. Қоңырауды үзіп, 1414 нөміріне өзіңіз хабарласыңыз.\n3. Кодты айтып қойсаңыз, банкке қоңырау шалып, картаны бұғаттаңыз.";
  if (has("бұғат", "заблок", "блок", "сілтеме", "ссылк", "link"))
    return "«Карта бұғатталды» деген хабарламадағы сілтеме көбіне жалған болады.\n\n1. Сілтемеге баспаңыз.\n2. Картаның жағдайын банктің ресми қосымшасынан тексеріңіз.\n3. Деректерді енгізіп қойсаңыз, «Жедел бұғаттау» бөлімі арқылы картаны дереу бұғаттаңыз.";
  if (has("туыс", "дауыс", "видео", "бейне", "ақша сұра", "деньги", "қарыз", "апат", "deepfake"))
    return "Бұл deepfake немесе бұзылған аккаунт арқылы жасалған алаяқтық болуы мүмкін.\n\n1. Ақша аудармаңыз.\n2. Ол адамның өз нөміріне қайта қоңырау шалып тексеріңіз.\n3. Туыстарыңызға «SOS-Ескерту» бөлімі арқылы ескерту жіберіңіз.";
  if (has("банк", "қызметкер", "сотрудник", "қоңырау", "звон", "несие", "кредит"))
    return "Бұл «банк қызметкері» болып қоңырау шалатын алаяқтың сценарийіне ұқсайды.\n\n1. Қоңырауды дереу үзіңіз.\n2. SMS-кодты ешкімге айтпаңыз, ақшаны «қауіпсіз шотқа» аудармаңыз.\n3. Банкке картаның артындағы нөмір бойынша өзіңіз қоңырау шалыңыз (Kaspi 9999, Halyk 7111, Jusan 7711, BCC 505).";
  if (has("код", "code", "cvv", "пароль", "құпия"))
    return "Кодты немесе құпия деректерді айтып қойсаңыз, уақыт маңызды.\n\n1. «Жедел бұғаттау» бөлімінде картаны бұғаттаңыз.\n2. Банк қосымшасының құпиясөзін ауыстырыңыз.\n3. 102 нөміріне хабарласып, полицияға арыз беріңіз.";
  return "Жағдайды толығырақ жазыңыз: кім хабарласты, не сұрады, сіз не айтып үлгердіңіз? Шұғыл жағдайда Dabyll желісіне 4143 қоңырау шалыңыз немесе «Жедел бұғаттау» бөлімін ашыңыз.";
}

/* Қауіпсіздік гиді */
function renderGuide() {
  app.innerHTML = frame("Алаяқтық сценарийлері", panel("guide", `
    <nav class="guide-list">${GUIDE.map((g) => `<a class="guide-item" href="#/guide/${g.id}">${esc(g.title)}</a>`).join("")}</nav>
  `), "#/");
}
function renderGuideItem(id) {
  const g = GUIDE.find((x) => x.id === id);
  if (!g) { location.hash = "#/guide"; return; }
  app.innerHTML = frame(g.title, panel("guide", `
    <p class="guide-text">${esc(g.text)}</p>
    <div class="todo"><strong>Не істеу керек?</strong><p>${esc(g.todo)}</p></div>
  `), "#/guide");
}

/* ---------- 4143 қоңырау имитациясы ---------- */
const overlay = document.getElementById("callOverlay");
let callTimer = null;
function startCall() {
  const box = overlay.querySelector(".call-box");
  const status = document.getElementById("callStatus");
  const timer = document.getElementById("callTimer");
  box.classList.remove("connected");
  status.textContent = "Қосылуда…"; timer.textContent = "00:00";
  overlay.hidden = false;
  document.getElementById("hangUp").focus();
  let sec = 0;
  clearInterval(callTimer);
  callTimer = setTimeout(() => {
    box.classList.add("connected");
    status.textContent = "Dabyll операторы байланыста";
    callTimer = setInterval(() => {
      sec++;
      timer.textContent = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
    }, 1000);
  }, 2200);
}
function endCall() {
  clearTimeout(callTimer); clearInterval(callTimer);
  overlay.hidden = true;
  toast("Қоңырау аяқталды");
}
document.getElementById("hangUp").addEventListener("click", endCall);
overlay.addEventListener("click", (e) => { if (e.target === overlay) endCall(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !overlay.hidden) endCall(); });

/* ---------- router ---------- */
function route() {
  const h = location.hash.replace(/^#/, "") || "/";
  const routes = {
    "/": renderHome,
    "/komek": renderKomek,
    "/sos": renderSos,
    "/sos/contacts": renderSosContacts,
    "/block": renderBlock,
    "/block/banks": renderBlockBanks,
    "/block/card": renderBlockCard,
    "/block/result": renderBlockResult,
    "/ai": renderAi,
    "/guide": renderGuide,
  };
  if (routes[h]) routes[h]();
  else if (h.startsWith("/guide/")) renderGuideItem(h.split("/")[2]);
  else renderHome();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);
route();
