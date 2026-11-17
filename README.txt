WAVE CENTRAL - STATIC WEBSITE
=============================

A plain HTML website. No build step, no server code, no external
dependencies. Upload the contents of this folder to your hosting and it
runs as-is.


WHAT IS IN HERE
---------------

index.html               Home page                ->  wave.net.in/
work.html                Work page                ->  wave.net.in/work.html
portfolio.html           Portfolio page           ->  wave.net.in/portfolio.html
about.html               About page               ->  wave.net.in/about.html
contact.html             Contact page             ->  wave.net.in/contact.html
404.html                 Page-not-found page

css/
  styles.css             The site stylesheet
  fonts.css              Font declarations
  fonts/*.woff2          The font files (self-hosted, no Google Fonts)

img/
  wave-logo.png          The Wave logo (header + footer)
  titan-01..04.jpg       The Titan project screenshots
  og-image.png           1200x630 preview image for WhatsApp / social
  icon-192.png           192x192 icon
  icon-512.png           512x512 icon
  apple-touch-icon.png   180x180 icon for iOS
  favicon.png            64x64 icon

js/
  site.js                The only JavaScript: mobile menu, portfolio
                         filters, copy buttons, contact form.

favicon.ico              Browser tab icon
robots.txt               Search-engine instructions
sitemap.xml              The 5 page URLs, for Google
site.webmanifest         Icon/app metadata
_headers                 Cache + security headers (Netlify / Cloudflare Pages)
.htaccess                Same settings for Apache / cPanel


HOW TO UPLOAD
-------------

First, check it offline: double-click index.html. It should open in your
browser with the full design, the logo, the images and working links.
Every link is relative, so it runs straight from the folder with no server.

cPanel / shared hosting (most Indian hosts)
  1. File Manager (or FTP) -> public_html
  2. Delete the current "Under Construction" index.html.
  3. Upload EVERYTHING inside this folder into public_html.
     Keep the css/, img/ and js/ folders - do not flatten them.
  4. Turn on "Show Hidden Files" so .htaccess uploads too.
  5. Open wave.net.in - the site should load.

Cloudflare Pages
  1. Create a Pages project -> "Direct Upload".
  2. Drag this folder (or the .zip) in.
  3. Add wave.net.in as a custom domain in Pages.

Netlify
  1. Drag this folder onto the dashboard.
  2. Add the domain under Domain settings.


THE DOMAIN
----------

Every canonical URL, the sitemap and the social image point at:

    https://wave.net.in

That is correct for this site. If the domain ever changes, tell me and I
will regenerate the build - nothing else depends on it.


THE CONTACT FORM
----------------

A static site has no server to receive form posts, so the form opens the
visitor's email app with the message filled in and addressed to
hello@wave.net.in.

To send silently instead (no email app, no server), get a free access key
at https://web3forms.com and set it in js/site.js:

    var WEB3FORMS_KEY = "your-access-key-here";

That is the only line to change. With a key the form posts by AJAX and
shows a thank-you message; with no key it falls back to the email app.


SEARCH ENGINES
--------------

Already done inside the pages:
  - a unique <title> and <meta description> on every page
  - a canonical URL on every page
  - Open Graph + Twitter card tags
  - structured data (Organization, WebSite, BreadcrumbList, page types)
  - sitemap.xml listing all five pages
  - robots.txt pointing at the sitemap
  - the full text of every page sits in the HTML - nothing needs JavaScript

After the domain is live:
  1. Add the site in Google Search Console (see GOOGLE-SEARCH-CONSOLE.txt).
  2. Submit  https://wave.net.in/sitemap.xml
  3. Request indexing for the five pages.
