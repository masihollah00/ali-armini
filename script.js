
/* علی آرمینی | دنیای رپ فارسی
   برنامه‌نویسی از طرف مسیح هکرینگ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // سال جاری در پاورقی، اگر عنصر مربوطه وجود داشته باشد
  const yearElement = document.querySelector("[data-current-year]");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // اسکرول نرم برای لینک‌های داخلی صفحه
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        event.preventDefault();
        return;
      }

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // اطلاع‌رسانی درباره آهنگ‌هایی که هنوز لینک ندارند
  document.querySelectorAll("audio").forEach((player) => {
    const source = player.querySelector("source");
    const sourceUrl = source ? source.getAttribute("src") : "";

    if (!sourceUrl || sourceUrl.trim() === "") {
      player.addEventListener("play", () => {
        player.pause();
        alert("این آهنگ هنوز بارگذاری نشده است؛ لینک آن به‌زودی اضافه می‌شود.");
      });
    }
  });

  // جلوگیری از نمایش خطای ساختگی برای لینک‌های خالی دانلود
  document.querySelectorAll('a[href=""], a[href="#"]').forEach((link) => {
    if (link.hasAttribute("download")) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        alert("لینک دانلود این آهنگ هنوز ثبت نشده است.");
      });
    }
  });

  console.log("سایت علی آرمینی با موفقیت بارگذاری شد.");
});
