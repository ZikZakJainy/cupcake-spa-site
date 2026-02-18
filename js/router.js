document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", async (e) => {
    const link = e.target.closest("[data-link]");
    if (!link) return;

    e.preventDefault();

    const url = link.getAttribute("href");
    history.pushState(null, "", url);
    await loadPage(url);
  });

  window.addEventListener("popstate", () => {
    loadPage(location.pathname);
  });
});

async function loadPage(url) {
  const response = await fetch(url);
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Update title
  document.title = doc.title;

  // Update meta description safely
  const newMeta = doc.querySelector('meta[name="description"]');
  let currentMeta = document.querySelector('meta[name="description"]');

  if (newMeta && currentMeta) {
    currentMeta.setAttribute("content", newMeta.getAttribute("content"));
  }

  // Update main content
  document.getElementById("app").innerHTML =
    doc.getElementById("app").innerHTML;
}
