// Nuvasah Interiors — main script.

// Client WhatsApp number in wa.me format (country code + number, digits only).
// Source: +91 74280 14947
const CLIENT_WHATSAPP_NUMBER = "917428014947";

// Secondary record of enquiries. Replace the placeholder below with the client's
// Formspree endpoint (e.g. "https://formspree.io/f/abcdwxyz"). Until it's replaced,
// the POST is skipped gracefully so the form keeps working.
const FORMSPREE_ENDPOINT = "PASTE_FORMSPREE_ENDPOINT_HERE";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  // Field id -> human label, in the order they appear on the form.
  const FIELDS = [
    ["name", "Name"],
    ["whatsapp", "WhatsApp"],
    ["email", "Email"],
    ["location", "Property Location"],
    ["bhk", "Property Size"],
    ["scope", "Scope of Work"],
    ["budget", "Estimated Budget"],
    ["message", "Message"],
  ];

  // Reusable on-page status line, inserted right after the form.
  let status = document.getElementById("form-status");
  if (!status) {
    status = document.createElement("p");
    status.id = "form-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.style.marginTop = "var(--space-sm)";
    status.style.color = "var(--color-accent)";
    form.appendChild(status);
  }

  function readValues() {
    const data = {};
    FIELDS.forEach(function (pair) {
      const el = document.getElementById(pair[0]);
      data[pair[0]] = el ? el.value.trim() : "";
    });
    return data;
  }

  function buildSummary(data) {
    const lines = ["New enquiry from the Nuvasah Interiors website:", ""];
    FIELDS.forEach(function (pair) {
      const value = data[pair[0]];
      lines.push(pair[1] + ": " + (value || "—"));
    });
    return lines.join("\n");
  }

  function postToFormspree(data) {
    // Skip gracefully if the endpoint hasn't been configured yet.
    if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT === "PASTE_FORMSPREE_ENDPOINT_HERE") {
      return;
    }
    try {
      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      }).catch(function () {
        // Network/endpoint errors must never block the WhatsApp flow.
      });
    } catch (e) {
      // Same: swallow so the form always works.
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = readValues();
    const summary = buildSummary(data);
    const waLink =
      "https://wa.me/" +
      CLIENT_WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(summary);

    // Confirmation before the redirect, so nothing happens silently.
    status.textContent = "Opening WhatsApp…";

    // Open synchronously in the submit handler so pop-up blockers allow it.
    window.open(waLink, "_blank");

    // Secondary record — fire-and-forget, never blocks or errors out.
    postToFormspree(data);
  });
});
