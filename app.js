const configured = window.SUPABASE_URL?.startsWith("https://") &&
  window.SUPABASE_ANON_KEY && !window.SUPABASE_ANON_KEY.startsWith("YOUR_");
const db = configured ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;

document.getElementById("menuToggle")?.addEventListener("click", () =>
  document.getElementById("nav").classList.toggle("open"));

document.querySelectorAll(".request-form").forEach(form => {
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    if (!db) {
      status.textContent = "아직 서버 설정 전이에요. README의 Supabase 설정을 먼저 완료해 주세요.";
      return;
    }
    const data = new FormData(form);
    const record = {
      kind: form.dataset.kind,
      category: data.get("category") || null,
      title: data.get("title") || null,
      message: String(data.get("message") || "").trim(),
      email: String(data.get("email") || "").trim() || null
    };
    const { error } = await db.from("requests").insert(record);
    if (error) {
      status.textContent = "접수하지 못했어요. 잠시 후 다시 시도해 주세요.";
      console.error(error);
      return;
    }
    status.textContent = "접수되었어요. 소중한 의견 감사합니다.";
    form.reset();
  });
});