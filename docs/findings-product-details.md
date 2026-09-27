# Findings — Product Details / Search assumptions vs. live catalog

Cross-check of the assumptions encoded in the product-search and product-details
suites against the live Demo Web Shop catalog (48 products across 31 category
pages, scraped 2026-09-26). Confirmed app defects (Discrepancies #1 and #2) are
now **caught by an automated test** — the availability hunter in
`product-details.spec.ts` (see [Availability hunter](#availability-hunter)),
which fails by design on the buggy products. The remaining findings are
documentation only.

## How this was verified

The initial scrape used faulty price/button regexes and produced wrong data
(every product read as priceless; the out-of-stock earrings mislabeled). It was
caught because it contradicted our passing tests, then re-run with a corrected
parser **validated against ground truth** (14.1-inch Laptop, Fiction, Diamond
Pave Earrings all matched known values), and the headline findings were
re-confirmed in a real browser (`input.add-to-cart-button` counts, `.stock
.value`, `.product-price span[itemprop=price]`).

## Assumptions and whether they hold catalog-wide

| Assumption (encoded in a test) | Our fixtures | Catalog-wide |
| :----------------------------- | :----------- | :----------- |
| Add-to-Cart presence follows availability (in stock ⇒ button on list+PDP; OOS ⇒ neither) | ✅ earrings, laptop, fiction, sneaker | ❌ (handbag, + in-stock-no-button class) |
| Tile actual price = PDP actual price | ✅ laptop, fiction | ❌ ("From" products) |
| Tile title = PDP title | ✅ | ✅ (all 48) |

<a name="availability-hunter"></a>
**Availability hunter.** The availability rule is no longer asserted only against
happy-path fixtures. `product-details.spec.ts` sweeps a curated cross-category
pool and, for each product, **derives the expected button state from that
product's own live availability** (in stock ⇒ button on list + PDP + back; OOS ⇒
none), then asserts the observed 3-checkpoint record against it. Consistent
products (laptop, fiction, earrings, sneaker) pass; the buggy products
(handbag, bracelet, camcorder, desktop) fail by design, so the defects surface
on every regression run. This is deliberately the opposite of pinning a
known-bad product and asserting it is bad — the test hunts contradictions and
would catch a *new* offender in the pool.

## Availability resolution rule

Because there is no product spec defining how stockless categories should
behave, `productPage.resolvedAvailability()` applies a third state: **a PDP with
no `.stock` element is treated as in stock.** This matches how those products
actually behave — gift cards, digital downloads, and training products render no
stock element yet are purchasable. Defaulting them to *out of stock* would
false-fail on the majority; defaulting to *in stock* fails loudly and rarely.

Caveat: attribute-dependent PDPs (e.g. the SLR camera) also lack `.stock` until
a variant is selected, so the rule can mask a variant that is genuinely out of
stock. Accepted as a documented approximation.

## Discrepancies

### 1. Out-of-stock product that keeps Add-to-Cart — SUSPECTED APP BUG

- **Genuine Leather Handbag with Cell Phone Holder & Many Pockets** —
  `Availability: Out of stock`, yet the Add-to-Cart button is present on **both**
  the tile and the PDP (browser-confirmed: main button count = 1).
- Contrast: **Diamond Pave Earrings** (our OOS fixture) is out of stock and
  correctly hides Add-to-Cart everywhere.
- The site is **not consistent** about hiding Add-to-Cart when out of stock.
  Confirmed app defect, caught by the availability hunter (the handbag run fails
  by design). Filed as a Jira bug with screenshot + video.

### 2. In-stock, priced products with no main Add-to-Cart — APP BUGS (11)

Eleven distinct products report `Availability: In stock` and display a valid
numeric price, yet expose **no main Add-to-Cart button** on the PDP. All 11 are
suspected app defects.

**Verification method (matters here).** The main purchase button is
`input.add-to-cart-button` (class `button-1`, id `add-to-cart-button-NN`) inside
`.add-to-cart-panel`. It is **not** the same control as the related-products
carousel buttons (`input.product-box-add-to-cart-button`, class `button-2`),
which appear on nearly every PDP and are easy to mistake for the product's own
button. Counts below separate the two, validated against the **14.1-inch
Laptop** control (`main:1`, `related:3`) — so `main:0` is a real absence, not a
timing or selector artifact. Captured live with `networkidle` on 2026-09-27.

| # | Product | Price | Availability | Options | Main button | Related tiles |
| :- | :------ | :---- | :----------- | :------ | :---------- | :------------ |
| 1 | [Green and blue Sneaker](https://demowebshop.tricentis.com/green-and-blue-sneaker) | 17.56 | In stock | Size, Color | **0** | 3 |
| 2 | [Fiction EX](https://demowebshop.tricentis.com/fiction-ex) | 24.00 | In stock | — | **0** | 2 |
| 3 | [Science](https://demowebshop.tricentis.com/science) | 51.00 | In stock | — | **0** | 6 |
| 4 | [1MP 60GB Hard Drive Handycam Camcorder](https://demowebshop.tricentis.com/hard-drive-handycam-camcorder) | 349.00 | In stock | — | **0** | 4 |
| 5 | [Camcorder](https://demowebshop.tricentis.com/camcorder) | 530.00 | In stock | — | **0** | 3 |
| 6 | [High Definition 3D Camcorder](https://demowebshop.tricentis.com/3d-camcorder) | 1300.00 | In stock | — | **0** | 3 |
| 7 | [Used phone](https://demowebshop.tricentis.com/used-phone) | 5.00 | In stock | — | **0** | 2 |
| 8 | [Desktop PC with CDRW](https://demowebshop.tricentis.com/desktop-pc-with-cdrw) | 500.00 | In stock | — | **0** | 0 |
| 9 | [Elite Desktop PC](https://demowebshop.tricentis.com/desktop-pc) | 1350.00 | In stock | — | **0** | 0 |
| 10 | [Diamond Tennis Bracelet](https://demowebshop.tricentis.com/diamond-tennis-bracelet) | 360.00 | In stock | — | **0** | 4 |
| 11 | [Vintage Style Three Stone Diamond Engagement Ring](https://demowebshop.tricentis.com/vintage-style-three-stone-diamond-engagement-ring) | 2100.00 | In stock | — | **0** | 4 |
| — | *14.1-inch Laptop (control)* | 1590.00 | In stock | — | **1** ✓ | 3 |

**What the missing button is *not*.** None of the 11 show "call for price", none
are out of stock, and only the Sneaker (#1) has attribute options. The earlier
"call for price / configurable / purchase-disabled" label was a guess and does
not hold — these are fully in stock and priced but simply omit the purchase
control, with no visible reason on the page.

**Note on #1 (Sneaker).** It is the only configurable product (Size/Color). A
store *could* gate the button behind attribute selection, but on this platform
the `.add-to-cart-panel` button is normally rendered regardless, so its absence
is still treated as a defect — flagged separately in case it is intentional.
Beware a look-alike: **Blue and green Sneaker** (`/blue-and-green-sneaker`,
11.00) is a *different* product that renders the button correctly on both its
tile and PDP; the affected one is **Green and blue Sneaker**
(`/green-and-blue-sneaker`, 17.56). The bug is independent of navigation path —
reaching the PDP via the Apparel & Shoes category lands on the same URL with no
main button.

**Note on the camcorders.** Searching `Camcorder` returns three distinct
products (#4 Handycam 349.00, #5 Camcorder 530.00, #6 3D 1300.00) — not
duplicates. All three are affected.

**Why this matters.** This is the **same class of defect as Discrepancy #1**,
seen from the other side: there, an out-of-stock product *keeps* its button;
here, in-stock priced products *lack* one. Together they show that **Add-to-Cart
presence does not track availability or price validity** on this site — the two
are decoupled. Any test that infers "buyable" from "in stock + has price" (or
vice versa) is encoding a rule the app does not enforce.

Consequence for the suite: "in stock ⇒ button present" does not hold catalog-wide.
The availability hunter asserts the rule per-product (deriving the expectation
from live stock) and fails on the offenders (bracelet, camcorder, desktop are in
the pool), so these defects are caught rather than merely documented. The sanity
tests no longer assert Add-to-Cart at all — that concern is fully owned by the
hunter.

### 3. "From" price ⇒ tile price ≠ PDP price

- Its tile also has **no** Add-to-Cart (options must be chosen first) while the
  PDP does — so tile-vs-PDP button presence is not 1:1 for these either.
- The only other "From" tile is the earrings (out of stock).

### 4. Title comparison — no discrepancies

Tile title equals PDP title for all 48 products. This assumption is solid.

### 5. Products with no Availability field (16)

All "TCP …" training products, digital downloads (Music, gift cards), and
Create Your Own Jewelry render **no `.stock` element** on the PDP. The
`productPage.availability` locator would time out on these. Our tests never hit
them, but the getter is not universal.

Side note: the SLR read as `In stock` / `670.00` in static HTML but rendered no
stock/price in the browser until attribute selection — some PDPs are
attribute-dependent, so even single-product behavior is not static.

### 6. Digital SLR Camera — design inconsistency, NOT a bug

Surfaced by the full-catalog sweep (2026-09-27) as the only product where the
tile and PDP button counts genuinely diverge: **list = 0, PDP = 2**. The PDP
renders **two** complete purchase panels (two `input.add-to-cart-button` — ids
`add-to-cart-button-18`/`-19` — two `.stock .value`, two price spans), and the
search tile shows no Add-to-Cart at all.

**Why this is not filed as a bug.** It still functions as expected: each variant
has its own working Add-to-Cart, so the product is purchasable. It behaves like a
"From"-priced product on the listing (no tile button; choose on the PDP), except
the PDP offers **two per-variant buy panels** instead of one selector + a single
Add-to-Cart. That is a **UI pattern inconsistency** with the rest of the catalog,
not a functional defect — we have no spec saying which pattern is canonical, and
nothing here is broken. Documented for awareness; deliberately kept out of the
`AVAILABILITY_CONSISTENCY_POOL` so the hunter is not fed a false positive (its
two-panel PDP would otherwise read as a list-vs-PDP contradiction).

## Fixture drift to watch

Our deterministic fixtures assume specific live-site state that can change:

- `PRODUCT_TERMS.OUT_OF_STOCK` ("earrings") relies on Diamond Pave Earrings
  staying out of stock. It sits in the hunter pool as a *consistent* OOS product;
  if restocked it stays consistent (button would appear with stock), so the
  hunter keeps passing — the drift is silent here, unlike the loud fixtures below.
- `PRODUCT_TERMS.NON_DISCOUNTED` / `DISCOUNTED` (laptop / fiction) rely on those
  products staying in stock with a plain (non-"From") price.
- `AVAILABILITY_CONSISTENCY_POOL` assumes its four buggy members (handbag,
  bracelet, camcorder, desktop) stay buggy. If the app is fixed, those runs flip
  to green — which correctly signals the defect is resolved and the Jira bug can
  close. Treat a green hunter as "verify the bug, then prune the pool member."
