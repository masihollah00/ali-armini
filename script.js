const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const searchInput = $("#searchInput");
const cards = $$(".track-card");
const emptyState = $("#emptyState");
const audio = $("#audioPlayer");
const playerBar = $("#playerBar");
const playerPlay = $("#playerPlay");
const seekBar = $("#seekBar");
let currentButton = null;

$("#year").textContent = new Date().getFullYear();

const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
$$(".main-nav a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

let activeFilter = "all";
function filterCards() {
  const term = searchInput.value.trim().toLocaleLowerCase("fa");
  let visible = 0;
  cards.forEach(card => {
    const haystack = `${card.dataset.title} ${card.dataset.artist} ${card.textContent}`.toLocaleLowerCase("fa");
    const matchesTerm = !term || haystack.includes(term);
    const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
    card.hidden = !(matchesTerm && matchesFilter);
    if (!card.hidden) visible++;
  });
  emptyState.hidden = visible > 0;
}
searchInput.addEventListener("input", filterCards);
$$("[data-search]").forEach(button => button.addEventListener("click", () => {
  searchInput.value = button.dataset.search;
  filterCards();
  $("#tracks").scrollIntoView({behavior: "smooth"});
}));
$$(".filter-chip").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  $$(".filter-chip").forEach(chip => chip.classList.toggle("selected", chip === button));
  filterCards();
}));

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}
function setPlayIcon(playing) {
  playerPlay.textContent = playing ? "Ⅱ" : "▶";
  if (currentButton) currentButton.textContent = playing ? "Ⅱ" : "▶";
}
function showPlayer(card) {
  $("#playerTitle").textContent = card.dataset.title || "آهنگ";
  $("#playerArtist").textContent = card.dataset.artist || "هنرمند";
  playerBar.hidden = false;
}
$$(".play-track").forEach(button => button.addEventListener("click", () => {
  const card = button.closest(".track-card");
  const src = button.dataset.src;
  if (!src) {
    alert("هنوز فایل صوتی برای این آهنگ اضافه نشده. فایل مجاز را در پوشه assets/audio قرار بده و مسیر آن را در کارت آهنگ ثبت کن.");
    return;
  }
  if (currentButton === button && audio.src) {
    if (audio.paused) audio.play(); else audio.pause();
    return;
  }
  if (currentButton) currentButton.textContent = "▶";
  currentButton = button;
  audio.src = src;
  showPlayer(card);
  audio.play().catch(() => alert("پخش فایل انجام نشد. مسیر و فرمت فایل صوتی را بررسی کن."));
}));
playerPlay.addEventListener("click", () => {
  if (!audio.src) return;
  if (audio.paused) audio.play(); else audio.pause();
});
audio.addEventListener("play", () => setPlayIcon(true));
audio.addEventListener("pause", () => setPlayIcon(false));
audio.addEventListener("loadedmetadata", () => { $("#duration").textContent = formatTime(audio.duration); });
audio.addEventListener("timeupdate", () => {
  $("#currentTime").textContent = formatTime(audio.currentTime);
  seekBar.value = audio.duration ? String(audio.currentTime / audio.duration * 100) : "0";
});
seekBar.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = Number(seekBar.value) / 100 * audio.duration;
});
audio.addEventListener("ended", () => setPlayIcon(false));
$("#playerClose").addEventListener("click", () => {
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  if (currentButton) currentButton.textContent = "▶";
  currentButton = null;
  playerBar.hidden = true;
});
$$(".download-track").forEach(button => button.addEventListener("click", () => {
  const src = button.dataset.src;
  if (src) {
    const link = document.createElement("a");
    link.href = src;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}));
filterCards();
