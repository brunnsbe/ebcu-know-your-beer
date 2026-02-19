# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Know Your Beer is a static website for the EBCU (European Beer Consumers Union) consumer education campaign. It helps consumers understand beer labels, make informed choices, and know their rights when buying beer in both shops (off-trade) and bars/restaurants (on-trade).

Built with Eleventy 3.x and Tailwind CSS 3.x.

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
  - `_includes/components/` - Reusable Nunjucks components (callout, checklist, faqAccordion, topicCard)
  - `assets/` - Static assets
    - `css/` - Tailwind CSS source (tailwind.css)
    - `images/` - Site images and photos
    - `fonts/` - Custom fonts
  - `topics/` - Topic pages (each uses topic.njk layout)
  - Root `.njk` files - Main pages (index, read-the-label, on-trade, faq, about)
- `_site/` - Build output (gitignored)
- `eleventy.config.js` - Eleventy configuration
- `tailwind.config.js` - Tailwind configuration

### Data Flow

Global data from `src/_data/*.json` is automatically available in all templates:
- `site` - Site metadata (name, org, tagline, description, launchWindow, contact info, languages, isDraft flag)
- `topics` - Array of 6 topic cards, each with slug, title, shortTitle, lead, icon
- `faqs` - FAQ questions and answers
- `cta` - Call-to-action button configurations (present but not currently referenced in any template)

### Layouts

- `base.njk` - Root HTML template with:
  - Sticky header with EBCU logo, "Know Your Beer" in gold, desktop navigation, language selector, mobile menu
  - Main content area
  - Footer with 3 columns (logo/description, Quick Links, Label Topics), independence statement, copyright
  - JavaScript for mobile menu and language dropdown interactivity
- `topic.njk` - Extends base with:
  - Blue header with breadcrumb (Read the label / Topic Title)
  - Title and lead text
  - Prose-styled article content
  - "More topics" footer grid showing other topics in blue cards

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
- Header: Sticky (`sticky top-0 z-50`), EBCU blue background, responsive with mobile hamburger menu
- Hero sections: Inline style with linear-gradient overlay and background image
- Language selector: Dropdown menu with placeholder options (Deutsch, Français, Nederlands marked as "soon")

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
   - Regulatory landscape callout explaining voluntary vs mandatory labeling, Ireland's 2028 requirements, and link to EU Consumer Agenda 2030
   - Health warning logos signpost linking to alcohol-style topic
   - Competition awards and medals section explaining EBCU-endorsed competitions with link to ebcu.org

3. **On-Trade** (`on-trade.njk`):
   - Blue header explaining on-trade context
   - Rights callout about allergen information
   - Image (bar_in_ireland.jpg)
   - "Questions you can ask" section with 2 cards: "Before ordering" and "For draught beer"
   - "Cask vs keg" section: side-by-side comparison, signs of a well-kept cask, why it matters callout
   - "What to look for" section with "Good signs" and "Worth questioning" cards
   - Related topics section linking to ingredients-allergens and who-made-it

4. **FAQ** (`faq.njk`):
   - Blue header
   - Image (couple.jpg)
   - Accordion-style FAQ using `<details>` elements (data from `faqs.json`)
   - Contact callout for additional questions
   - FAQ topics include: campaign overview, ingredient labeling regulations (voluntary vs mandatory), QR codes, brewed for/brewed at, freshness dates, EBCU independence, partnerships, languages, EU Consumer Agenda 2030, and consumer rights in bars/restaurants

5. **About** (`about.njk`):
   - Blue header
   - Values section (3 cards: Educational, Constructive, For Everyone)
   - Image (ebcu.jpg)
   - Prose content explaining the campaign, why it exists, and voluntary beer labeling context
   - "Supporting EU consumer goals" section linking to EU Consumer Agenda 2030 and European Consumer Summit
   - Independence & transparency callout box with bullet points
   - Partners section, Contact section with site.json data, About EBCU section with link
   - Useful resources section with links to EU Consumer Agenda, EU Alcohol Labelling, EU Food Information Regulation, and EBCU-endorsed competitions

### Topics

Six topic pages in `src/topics/`:
1. `alcohol-style.njk` - Alcohol content, serving size & beer style; also covers health warning logos (pregnancy, drink-driving, minimum age, responsible drinking)
2. `ingredients-allergens.njk` - Ingredients & allergens; ends with cross-link to on-trade page for allergen rights
3. `who-made-it.njk` - Who made this beer?; includes independent brewer logos section and cross-link to where-brewed
4. `where-brewed.njk` - Where was it brewed?; includes EU quality logos (PGI, PDO, TSG) with beer examples, Trappist and Belgian Abbey Beer designations; cross-links to who-made-it
5. `freshness-dates.njk` - Freshness, dates & traceability
6. `storage-serving.njk` - Storage, sediment & 'live' beer handling; brief cask mention cross-linking to on-trade

Each topic uses `topic.njk` layout and has frontmatter with `layout`, `title`, and `slug`.

### Icons

Topic icons are inline SVG elements defined with conditional logic in:
- `index.njk` (home page topic cards)
- `read-the-label.njk` (topic cards)

Available icons: `percent`, `grain`, `users`, `location`, `calendar`, `storage`

### Adding a New Topic

1. Add entry to `src/_data/topics.json`:
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
   ---
   Content here using Markdown or HTML with Tailwind classes
   ```
3. Add icon SVG conditional to `index.njk` and `read-the-label.njk` if using a new icon name

### Eleventy Configuration

Key features in `eleventy.config.js`:
- Pass-through copy for images and fonts (Tailwind writes CSS directly to `_site/`, no passthrough needed)
- Watch target for CSS directory
- Custom filter `findBySlug` for finding topics by slug
- Custom shortcode `year` for current year in footer
- Input directory: `src`, Output: `_site`
- Template formats: njk, md, html

### Images

Images stored in `src/assets/images/`:
- `cropped-web-new.png` - EBCU logo used in header and footer
- `sven-brandsma-PnA6lW19eMg-unsplash.jpg` - Hero background image
- Various content images: `man_label_2.jpg`, `bar_in_ireland.jpg`, `couple.jpg`, `ebcu.jpg`, `brewery.jpg`, `alcohol.jpg`, etc.

### Development Notes

- Site is marked as draft (`isDraft: true` in site.json) but no draft badge is currently displayed
- Language selector is implemented in UI but only English is active; other languages show "(soon)"
- Launch window is controlled by `site.launchWindow` in `site.json`
- `page.njk` layout exists but is not used; main pages implement their own blue header section inline using `base.njk`
- Prose styling uses manually defined `.prose` styles in `tailwind.css` — `@tailwindcss/typography` is NOT installed; `prose-lg` has no effect
- Footer includes independence statement in a blue-light callout box
