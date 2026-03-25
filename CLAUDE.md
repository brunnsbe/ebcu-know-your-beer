# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Know Your Beer is a static website for the EBCU (European Beer Consumers Union) consumer education campaign. It helps consumers understand beer labels, make informed choices, and know their rights when buying beer in both shops (off-trade) and bars/restaurants (on-trade).

Live at [knowyour.beer](https://knowyour.beer). Built with Eleventy 3.x and Tailwind CSS 3.x.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server (Eleventy + Tailwind watch)
npm run build        # Production build
npm run clean        # Remove _site output directory
```

## Architecture

### Directory Structure

- `src/` - Source files
  - `_data/` - Global data files (JSON) used across templates
  - `_includes/layouts/` - Page layouts (base.njk, topic.njk, page.njk)
  - `assets/` - Static assets
    - `css/` - Tailwind CSS source (tailwind.css)
    - `images/` - Site images and photos
    - `fonts/` - Custom fonts
  - `topics/` - English topic pages (each uses topic.njk layout)
  - `de/`, `fr/`, `it/`, `es/`, `pl/`, `nl/` - Translated page directories
    - Each contains the same set of pages as the English root
    - Each contains a `{lang}.11tydata.json` directory data file
    - Each contains a `topics/` subdirectory for the 6 topic pages
  - Root `.njk` files - English main pages (index, read-the-label, on-trade, faq, about)
- `_site/` - Build output (gitignored)
- `eleventy.config.js` - Eleventy configuration
- `tailwind.config.js` - Tailwind configuration

### Data Flow

Global data from `src/_data/*.json` is automatically available in all templates:
- `site` - Site metadata (name, org, tagline, description, launchWindow, contactEmail, languages, defaultLanguage, isDraft flag)
- `topics` - Array of 6 topic cards, each with slug, title, shortTitle, lead, icon. **Overridden per-language** by `{lang}.11tydata.json` with translated titles and leads.
- `faqs` - FAQ questions and answers. **Overridden per-language** by `{lang}.11tydata.json` with translated questions and answers.
- `ui` - Layout UI strings keyed by language code (`ui.en`, `ui.de`, etc.): nav labels, footer headings, independence statement, copyright, "Learn More", "All topics", etc.
- `cta` - Call-to-action button configurations (present but not currently referenced in any template)

### Layouts

- `base.njk` - Root HTML template with:
  - Sticky header with EBCU logo, "Know Your Beer" in gold, desktop navigation (labels from `ui[uiLang]`), language selector, mobile menu
  - Main content area
  - Footer with 3 columns (logo/description, Quick Links, Label Topics), independence statement, copyright — all strings from `ui[uiLang]`
  - JavaScript for mobile menu and language dropdown interactivity
  - `lang` attribute on `<html>` is dynamic (`page.lang or 'en'`)
  - Two Nunjucks helpers computed at the top of the template:
    - `langPrefix` — empty string for English, `'/de'` etc. for other languages; used to prefix internal links
    - `basePath` — `page.url` with the language prefix stripped; used to build language-switcher links (e.g. on `/de/topics/alcohol-style/`, `basePath` is `/topics/alcohol-style/`)
- `topic.njk` - Extends base with:
  - Blue header with breadcrumb ("Read the label" text from `ui[uiLang].breadcrumb_read` / Topic Title)
  - Title and lead text
  - Prose-styled article content
  - "All topics" footer grid (heading from `ui[uiLang].all_topics`) showing all 6 topics; links use `langPrefix`; the current page is rendered as a non-clickable light-blue card, others as clickable blue cards

Note: `page.njk` exists in `_includes/layouts/` but is not currently used by any page — all main pages use `base.njk` directly and implement their own blue header section inline.

### Design System

**Brand colors** (defined in `tailwind.config.js`):
- `ebcu-blue` (#003399) - Primary EBCU blue for headers, backgrounds, topic cards
- `ebcu-blue-dark` (#002266) - Dark blue for hover states and mobile menu background
- `ebcu-blue-light` (#e6ecf5) - Light blue for icon badges and callout backgrounds
- `ebcu-gold` (#DE9E55) - Gold/mustard for action links, "Learn More" text, site name
- `ebcu-gold-dark` (#c48a43) - Darker gold for link hover states

**Typography**:
- Body text: 'Open Sans', Arial, sans-serif (default `font-sans`)
- Display/Navigation: 'Montserrat', Helvetica, Arial, Lucida, sans-serif (`font-display`)

**Key patterns**:
- Topic cards: Blue background (`bg-ebcu-blue`) with white text, gold "Learn More" links appearing on hover (`opacity-0 group-hover:opacity-100`), hover to darker blue (`hover:bg-ebcu-blue-dark`)
- Callout boxes: Gray background (`bg-gray-50`) with border (`border border-gray-200`) and subtle shadow (`shadow-sm`)
- Blue callout boxes: `border border-ebcu-blue/30 bg-ebcu-blue/5` for informational callouts; `border border-ebcu-blue bg-ebcu-blue-light` for regulatory/policy callouts
- Header: Sticky (`sticky top-0 z-50`), EBCU blue background, responsive with mobile hamburger menu
- Hero sections: Inline style with linear-gradient overlay and background image
- Language selector: Dropdown menu; all 7 languages (EN/DE/FR/IT/ES/PL/NL) are active with links
- Table of contents: `<nav>` block with "On this page" heading and anchor links, used on most topic pages and on-trade

### Main Pages

1. **Home** (`index.njk`):
   - Hero section with dark overlay (30% black) on background image, two CTAs ("Start: Read the label", "On-trade checklist")
   - "What you'll learn" section with 6 topic cards in responsive grid
   - Partners section with placeholder for future partner logos and launch window info

2. **Read the Label** (`read-the-label.njk`):
   - Blue header with title and lead
   - Introductory callout about EU label requirements
   - Image with caption (man_label_2.jpg)
   - 6 topic cards in responsive grid
   - Quick reference section with 3 cards: "Required by law", "Voluntary (industry commitment)", "Often optional"
   - Regulatory landscape callout explaining voluntary vs mandatory labeling and Ireland's 2028 requirements
   - Signpost callouts linking to alcohol-style (health warning logos) and marks-logos-certifications (competition awards, GI logos etc.)

3. **On-Trade** (`on-trade.njk`):
   - Blue header explaining on-trade context
   - Table of contents
   - Rights callout about allergen information
   - Image (bar_in_ireland.jpg)
   - "Questions you can ask" section with 2 cards: "Before ordering" and "For draught beer"
   - "Cask vs keg" section: side-by-side comparison, signs of a well-kept cask, why it matters callout
   - "What to look for" section with "Good signs" and "Worth questioning" cards
   - Related topics section linking to ingredients-allergens and producer-origin

4. **FAQ** (`faq.njk`):
   - Blue header
   - Image (couple.jpg)
   - Accordion-style FAQ using `<details>` elements (data from `faqs.json`, overridden per-language)
   - Contact callout linking to about page

5. **About** (`about.njk`):
   - Blue header
   - Values section (3 cards: Educational, Constructive, For Everyone)
   - Image (ebcu.jpg)
   - Prose content explaining the campaign, why it exists, and voluntary beer labeling context
   - "Supporting EU consumer goals" section linking to EU Consumer Agenda 2030 and European Consumer Summit
   - Independence & transparency callout box with bullet points
   - Partners section, Contact section (email only: know-your-beer@ebcu.org), About EBCU section with link
   - Useful resources section with links to EU Consumer Agenda, EU Alcohol Labelling, EU Food Information Regulation, EBCU-endorsed competitions, and EU PPWR

### Topics

Six topic pages in `src/topics/`:
1. `alcohol-style.njk` - Alcohol content, serving size & beer style; also covers health warning logos (pregnancy, drink-driving, minimum age, responsible drinking)
2. `ingredients-allergens.njk` - Ingredients & allergens; ends with cross-link to on-trade page for allergen rights
3. `producer-origin.njk` - Producer & origin; covers producer phrases (brewed by/for etc.), EU law requirements, finding brewing location, misleading patterns, contract brewing scenarios
4. `marks-logos-certifications.njk` - Marks, logos & certifications; covers EU GI logos (PGI, PDO, TSG) with examples, Trappist and Belgian Abbey Beer, independent brewer logos, competition awards, vegan labels, recycling marks, deposits and PPWR
5. `freshness-dates.njk` - Freshness, dates & traceability
6. `storage-serving.njk` - Storage, sediment & 'live' beer handling; brief cask mention cross-linking to on-trade

Each topic uses `topic.njk` layout and has frontmatter with `layout`, `title`, `slug`, and `contentVersion`.

Most topic pages include a table of contents (`<nav>` with "On this page" heading) after the intro paragraph, with anchor links to each `<h2 id="...">` section. `freshness-dates.njk` is the exception — it is short enough not to need one.

### Icons

Topic icons are inline SVG elements defined with conditional logic in:
- `index.njk` (home page topic cards)
- `read-the-label.njk` (topic cards)
- `topic.njk` (all-topics footer grid)

Available icons: `percent`, `grain`, `users`, `badge`, `calendar`, `storage`

### Adding a New Topic

1. Add entry to `src/_data/topics.json` (English):
   ```json
   {
     "slug": "topic-slug",
     "title": "Full Title",
     "shortTitle": "Short Title for Navigation",
     "lead": "One-sentence description",
     "icon": "icon-name"
   }
   ```
2. Create `src/topics/{slug}.njk`:
   ```yaml
   ---
   layout: layouts/topic.njk
   title: Topic Title
   slug: topic-slug
   contentVersion: "YYYY-MM-DD"
   ---
   Content here using HTML with Tailwind classes
   ```
3. Add icon SVG conditional to `index.njk` and `read-the-label.njk` if using a new icon name (also add to `topic.njk` all-topics grid)
4. Add translated topic entry to each language's `{lang}.11tydata.json`
5. Create translated topic page in each `src/{lang}/topics/{slug}.njk`

### Eleventy Configuration

Key features in `eleventy.config.js`:
- `EleventyI18nPlugin` with `defaultLanguage: "en"` and `errorMode: "allow-fallback"`
- Pass-through copy for images and fonts (Tailwind writes CSS directly to `_site/`, no passthrough needed)
- Watch target for CSS directory
- Custom filter `findBySlug` for finding topics by slug
- Custom shortcode `year` for current year in footer
- Input directory: `src`, Output: `_site`
- Template formats: njk, md, html

### Internationalisation

The site is fully translated into six languages. Content is served at language-prefixed URLs, except English which is at the root.

**Active languages:**
- English (`en`) — `src/` → `/`
- German (`de`) — `src/de/` → `/de/`
- French (`fr`) — `src/fr/` → `/fr/`
- Italian (`it`) — `src/it/` → `/it/`
- Spanish (`es`) — `src/es/` → `/es/`
- Polish (`pl`) — `src/pl/` → `/pl/`
- Dutch (`nl`) — `src/nl/` → `/nl/`

**Per-language directory structure** (identical across all 6 translated languages):
```
src/{lang}/
  {lang}.11tydata.json   ← sets lang, overrides topics[] and faqs[]
  index.njk
  read-the-label.njk
  on-trade.njk
  faq.njk
  about.njk
  topics/
    alcohol-style.njk
    ingredients-allergens.njk
    producer-origin.njk
    marks-logos-certifications.njk
    freshness-dates.njk
    storage-serving.njk
```

**Directory data files** (`{lang}.11tydata.json`):
- Set `"lang": "{lang}"` so the i18n plugin knows the language
- Override `"topics"` array with translated `title`, `shortTitle`, `lead` (slugs and icons stay the same)
- Override `"faqs"` array with translated `question` and `answer` fields
- These overrides cascade to the `topics/` subdirectory automatically

**UI strings** (`src/_data/ui.json`):
- All layout-level strings keyed by language code: `ui.en`, `ui.de`, `ui.fr`, `ui.it`, `ui.es`, `ui.pl`, `ui.nl`
- Keys: `nav_home`, `nav_read`, `nav_ontrade`, `nav_faq`, `nav_about`, `footer_quicklinks`, `footer_labeltopics`, `footer_readlabel`, `footer_ontrade`, `footer_faq`, `footer_about`, `footer_desc`, `independence_title`, `independence_body`, `copyright`, `learn_more`, `on_this_page`, `all_topics`, `breadcrumb_read`, `lang_soon`
- Used in `base.njk` and `topic.njk` as `{{ ui[uiLang].key }}`

**Language-aware link patterns in templates:**
- `langPrefix` is set at the top of `base.njk` and `topic.njk`: `''` for English, `'/de'` etc. for translated pages
- Internal links: `href="{{ langPrefix }}/read-the-label/"`, `href="{{ langPrefix }}/topics/{{ topic.slug }}/"`
- In translated page files (not layouts), hardcode the language prefix: `href="/de/topics/..."` etc.
- Language-switcher links use `basePath` (page URL with language prefix stripped): English → `{{ basePath }}`, others → `/de{{ basePath }}`, `/fr{{ basePath }}` etc.

**Translation rules:**
- Slugs stay in English (URLs are language-agnostic: `/de/topics/alcohol-style/` not `/de/themen/alkohol/`)
- Technical terms stay in English: ABV, IPA, CO₂, PGI/PDO/TSG (with local equivalents noted in body copy where appropriate)
- External URLs never change
- Image paths never change
- All translated pages include `translatedFrom: "YYYY-MM-DD"` matching the English `contentVersion` at the time of translation
- If English `contentVersion` is newer than a translation's `translatedFrom`, the translation is out of date

**Adding a new language:**
1. Add the language code to `"languages"` in `site.json`
2. Add UI strings for the new language to `ui.json`
3. Create `src/{lang}/` directory with `{lang}.11tydata.json` (translated topics + faqs)
4. Create all 11 page files (5 main + 6 topics) following the existing translated page patterns
5. Add an entry to the language selector in `base.njk` (desktop and mobile menus)

### Images

Images stored in `src/assets/images/`:
- `cropped-web-new.png` - EBCU logo used in header and footer
- `sven-brandsma-PnA6lW19eMg-unsplash.jpg` - Hero background image
- Various content images: `man_label_2.jpg`, `bar_in_ireland.jpg`, `couple.jpg`, `ebcu.jpg`, `brewery.jpg`, `alcohol.jpg`, `porterhousetaps.jpg`, etc.
- Logo images: `pgi_logo.png`, `pdo_logo.png`, `etg_logo.png`, `TSG-logo-UK.jpg`, `trappist.png`, `abbey-beer.jpg`, `pregnant.png`, `drink_drive.png`, `drinking_age.png`, `eu-organic-logo.png`, `logo-indipendente-artigianale.png`

### Development Notes

- Site is marked as draft (`isDraft: true` in site.json) but no draft badge is currently displayed
- Launch window is controlled by `site.launchWindow` in `site.json`
- `page.njk` layout exists but is not used; main pages implement their own blue header section inline using `base.njk`
- Prose styling uses manually defined `.prose` styles in `tailwind.css` — `@tailwindcss/typography` is NOT installed; `prose-lg` has no effect
- Footer includes independence statement in a blue-light callout box
- JSON in `{lang}.11tydata.json` files must not contain unescaped ASCII double-quote characters (U+0022) inside string values — use `\"` for any quoted phrases within FAQ text, or use Unicode typographic quotes (U+201C/U+201D) for opening/closing quotes
