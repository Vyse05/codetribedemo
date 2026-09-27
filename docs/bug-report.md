# Bug Report — Demo Web Shop

Defects found while automating the core flows of the
[Tricentis Demo Web Shop](https://demowebshop.tricentis.com/), ordered by
priority. Both are caught automatically by the availability hunter in
`product-details.spec.ts`, which derives each product's expected Add-to-Cart
state from its live stock and fails on any contradiction. Screenshot + video
(human-paced) are attached to the linked Jira tickets.

Priority scale: **P1** — blocks a purchase or corrupts trust in stock state;
**P2** — same class of defect, lower blast radius / edge instances.

## Summary

| Priority | Bug | Jira | Where caught |
| :------- | :-- | :--- | :----------- |
| **P1** | Out-of-stock product still shows Add to Cart | [KAN-11](https://lukasworkspace-40406142.atlassian.net/browse/KAN-11) | hunter — `handbag` |
| **P2** | In-stock priced products expose no Add to Cart (class) | [KAN-12](https://lukasworkspace-40406142.atlassian.net/browse/KAN-12) | hunter — `bracelet`, `camcorder`, `desktop` |

---

## P1 — Out-of-stock product still shows Add to Cart

**Product:** Genuine Leather Handbag with Cell Phone Holder & Many Pockets
(`/genuine-leather-handbag-with-cell-phone-holder-many-pockets`) · **Jira:** KAN-11

An out-of-stock product still renders an Add to Cart button on both the
search-results tile and the product page, so a shopper can attempt to buy
something the store reports as unavailable.

- **Expected:** out of stock ⇒ no Add to Cart on the tile or the PDP.
- **Actual:** Add to Cart present at all three checkpoints — tile, PDP, and tile
  again after navigating back.

**Steps to reproduce**

1. Search for `handbag` (or open the product URL directly).
2. Observe the search-results tile shows an Add to Cart button.
3. Open the product-details page.
4. Confirm Availability reads "Out of stock".
5. Observe the PDP still shows an Add to Cart button.

**Why P1:** it directly contradicts stock state on a purchase control — the
highest-trust element on the page — and would let a customer start an
unfulfillable order.

---

## P2 — In-stock priced products expose no Add to Cart

**Exemplar:** Diamond Tennis Bracelet (`/diamond-tennis-bracelet`, 360.00) ·
**Jira:** KAN-12

Multiple in-stock, priced products render no Add to Cart button on either the
tile or the PDP, so they cannot be purchased despite appearing available.

- **Expected:** in stock ⇒ Add to Cart present on the tile and the PDP.
- **Actual:** no Add to Cart at any checkpoint, though the product is in stock
  and priced.

**Steps to reproduce (Diamond Tennis Bracelet)**

1. Search for `bracelet` (or open the product URL directly).
2. Observe the search-results tile shows no Add to Cart button.
3. Open the product-details page.
4. Confirm Availability reads "In stock" and a price (360.00) is shown.
5. Observe the PDP shows no Add to Cart button.

**Other affected products (same defect, confirmed by full-catalog sweep):**
Fiction EX, Science, Used phone, Elite Desktop PC, Desktop PC with CDRW,
1MP 60GB Hard Drive Handycam Camcorder, Camcorder, High Definition 3D Camcorder,
Vintage Style Three Stone Diamond Engagement Ring, Green and blue Sneaker.

**Why P2:** same underlying decoupling of Add-to-Cart from stock as the P1, but
it *blocks* rather than wrongly *enables* a purchase, and the store still shows
these as in stock. Grouped as one class rather than one ticket per product.

---

## Not filed as bugs (documented)

- **Digital SLR Camera 12.2 Mpixel** — the PDP renders two per-variant purchase
  panels (each with its own working Add to Cart) while the tile has none. It is
  purchasable and functions correctly; it is a **UI pattern inconsistency** with
  the rest of the catalog (per-variant panels vs. a selector + single button),
  not a defect. See [findings-product-details.md](findings-product-details.md#6-digital-slr-camera--design-inconsistency-not-a-bug).

## Method & scope

Full details of how the catalog was verified — the selector distinctions, the
availability-resolution rule, and the full-catalog sweep (52 products) that
confirmed the affected set — are in
[findings-product-details.md](findings-product-details.md).
