const configured = window.SUPABASE_URL?.startsWith("https://") &&
  window.SUPABASE_ANON_KEY && !window.SUPABASE_ANON_KEY.startsWith("YOUR_");
const db = configured ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;
const loginForm = document.getElementById("loginForm");
const statusEl = document.getElementById("loginStatus");
const dashboard = document.getElementById("dashboard");
const list = document.getElementById("requestList");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
async function refresh() {
  if (!db) return;
  const { data, error } = await db.from("requests").select("*").order("created_at", {ascending:false}).limit(100);
  if (error) { list.textContent = "내역을 불러오지 못했습니다."; return; }
  list.innerHTML = data.length ? data.map(item => `
    <article class="panel" style="margin:12px 0;padding:16px">
      <div class="panel-top"><span>${escapeHtml(item.kind)} · ${escapeHtml(item.created_at)}</span><span>${escapeHtml(item.status || "신규")}</span></div>
      <h3>${escapeHtml(item.title || item.category || item.kind)}</h3>
      <p style="white-space:pre-wrap;color:#c1d0df;font-size:13px">${escapeHtml(item.message)}</p>
      <p class="muted small">회신 이메일: ${escapeHtml(item.email || "미기재")}</p>
    </article>`).join("") : "아직 접수된 내용이 없습니다.";
}
async function showSession() {
  if (!db) return;
  const { data } = await db.auth.getSession();
  const loggedIn = !!data.session;
  dashboard.hidden = !loggedIn;
  loginForm.hidden = loggedIn;
  if (loggedIn) refresh();
}
loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  if (!db) { statusEl.textContent = "Supabase 설정을 먼저 완료해 주세요."; return; }
  statusEl.textContent = "로그인 중...";
  const { error } = await db.auth.signInWithPassword({
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  });
  statusEl.textContent = error ? "로그인에 실패했어요. 계정 정보를 확인해 주세요." : "";
  await showSession();
});
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await db?.auth.signOut();
  await showSession();
});
if (db) {
  db.auth.onAuthStateChange(() => showSession());
  showSession();
} else {
  statusEl.textContent = "Supabase 설정 전입니다. README를 따라 설정해 주세요.";
}