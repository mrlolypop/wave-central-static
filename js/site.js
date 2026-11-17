/* Wave Central - static site behaviour.
 * Replaces the four interactive pieces of the React app:
 *   1. mobile navigation panel
 *   2. portfolio filters
 *   3. copy-to-clipboard buttons
 *   4. contact form
 * No framework, no build step.
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* 1. Mobile navigation                                                */
  /* ------------------------------------------------------------------ */
  var menuBtn = document.querySelector("header button[aria-expanded]");
  var panel = document.getElementById("mobile-menu");

  function setMenu(open) {
    if (!menuBtn || !panel) return;
    panel.classList.toggle("hidden", !open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    var iconOpen = menuBtn.querySelector('[data-icon="open"]');
    var iconClose = menuBtn.querySelector('[data-icon="close"]');
    if (iconOpen) iconOpen.classList.toggle("hidden", open);
    if (iconClose) iconClose.classList.toggle("hidden", !open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (menuBtn && panel) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setMenu(false);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 2. Portfolio filters                                                */
  /* ------------------------------------------------------------------ */
  var tablist = document.querySelector('[role="tablist"][aria-label="Filter portfolio"]');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var entries = Array.prototype.slice.call(document.querySelectorAll("li[data-category]"));
    var BASE =
      "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors";
    var ON = "border-primary bg-primary text-primary-foreground";
    var OFF = "border-hairline-strong text-muted-foreground hover:text-foreground";

    var applyFilter = function (filter) {
      tabs.forEach(function (tab) {
        var on = tab.getAttribute("data-filter") === filter;
        tab.className = BASE + " " + (on ? ON : OFF);
        tab.setAttribute("aria-selected", on ? "true" : "false");
        var count = tab.querySelector("span");
        if (count) count.className = "tabular-nums " + (on ? "opacity-70" : "opacity-50");
      });
      entries.forEach(function (li) {
        var show = filter === "All" || li.getAttribute("data-category") === filter;
        li.style.display = show ? "" : "none";
      });
    };

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        applyFilter(tab.getAttribute("data-filter"));
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 3. Copy buttons                                                     */
  /* ------------------------------------------------------------------ */
  var CHECK_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check h-3.5 w-3.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';

  function legacyCopy(value) {
    var ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      var svg = btn.querySelector("svg");
      var previous = svg ? svg.outerHTML : "";
      var flash = function () {
        var current = btn.querySelector("svg");
        if (current) current.outerHTML = CHECK_SVG;
        btn.classList.add("border-primary/60", "text-primary");
        window.setTimeout(function () {
          var now = btn.querySelector("svg");
          if (now) now.outerHTML = previous;
          btn.classList.remove("border-primary/60", "text-primary");
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(flash, function () {
          if (legacyCopy(value)) flash();
        });
      } else if (legacyCopy(value)) {
        flash();
      }
    });
  });

  /* ------------------------------------------------------------------ */
  /* 4. Contact form                                                     */
  /* ------------------------------------------------------------------ */
  var form = document.getElementById("contact-form");

  if (form) {
    /* Delivery. Leave the key empty to use the visitor's email app.
       Paste a Web3Forms access key (https://web3forms.com) to send
       submissions by AJAX instead, no backend required. */
    var WEB3FORMS_KEY = "";
    var CONTACT_EMAIL = "hello@wave.net.in";

    var status = document.getElementById("form-status");
    var submit = document.getElementById("contact-submit");
    var message = document.getElementById("message");
    var counter = document.getElementById("message-count");

    function say(text, kind) {
      if (!status) return;
      status.textContent = text;
      status.className = "text-sm " + (kind === "error" ? "text-destructive" : "text-primary");
    }

    function clearStatus() {
      if (!status) return;
      status.textContent = "";
      status.className = "hidden text-sm";
    }

    if (message && counter) {
      var syncCount = function () {
        counter.textContent = String(message.value.length);
      };
      message.addEventListener("input", syncCount);
      syncCount();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearStatus();

      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var honeypot = form.querySelector('div[aria-hidden="true"] input');
      var discipline = form.querySelector('input[name="discipline"]:checked');

      if (honeypot && honeypot.value) return;

      if (!name.value.trim() || name.value.trim().length < 2) {
        say("Please add your name.", "error");
        name.focus();
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        say("Please add a valid email address.", "error");
        email.focus();
        return;
      }
      if (!message.value.trim() || message.value.trim().length < 10) {
        say("Please add a short message (at least 10 characters).", "error");
        message.focus();
        return;
      }

      var area = discipline ? discipline.closest("label").textContent.trim() : "General Wave enquiry";
      var payload = {
        name: name.value.trim(),
        email: email.value.trim(),
        area: area,
        message: message.value.trim(),
      };

      if (WEB3FORMS_KEY) {
        if (submit) submit.disabled = true;
        say("Sending...");
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: "Wave enquiry - " + payload.area,
            from_name: "Wave Central website",
            name: payload.name,
            email: payload.email,
            area: payload.area,
            message: payload.message,
          }),
        })
          .then(function (r) {
            return r.json();
          })
          .then(function (data) {
            if (data && data.success) {
              form.reset();
              if (counter) counter.textContent = "0";
              say("Thank you - your enquiry has been sent. We reply from " + CONTACT_EMAIL + ".");
            } else {
              say("That didn't send. Please email " + CONTACT_EMAIL + " directly.", "error");
            }
          })
          .catch(function () {
            say("That didn't send. Please email " + CONTACT_EMAIL + " directly.", "error");
          })
          .then(function () {
            if (submit) submit.disabled = false;
          });
        return;
      }

      var body =
        "Name: " + payload.name + "\n" +
        "Email: " + payload.email + "\n" +
        "Area: " + payload.area + "\n\n" +
        payload.message + "\n";

      window.location.href =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent("Wave enquiry - " + payload.area) +
        "&body=" + encodeURIComponent(body);

      say("Opening your email app with the enquiry. If nothing opens, email " + CONTACT_EMAIL + " directly.");
    });
  }
})();
