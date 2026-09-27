import { test, expect } from "@fixtures/demowebshop-e2e-fixtures";
import { CATEGORIES, CATEGORY_TREE } from "@constants/category-constants";
import { Tags } from "@constants/tags";

/**
 * Category-verification suite: navigates to Apparel & Shoes, jumps to the last
 * page via the highest pager number, and confirms both pages show products.
 */
test.describe("Category and Pagination Verification", () => {
  // Hardcoded, not randomised: Apparel & Shoes is the only category that paginates.
  const { slug, title } = CATEGORIES.APPAREL_SHOES;

  test(
    `jumps to the last ${title} page and shows products throughout`,
    { tag: Tags.SANITY },
    async ({ categoryPage }) => {
      await categoryPage.goto(slug);
      await expect(categoryPage.title).toHaveText(title);
      await expect(categoryPage.currentPage).toHaveText("1");
      expect(await categoryPage.products.count()).toBeGreaterThan(0);

      await categoryPage.goToLastPage();
      await expect(categoryPage.nextPage).toHaveCount(0);
      expect(await categoryPage.products.count()).toBeGreaterThan(0);
    },
  );

  // Selecting a subcategory is confirmed via the breadcrumb, independent of product presence.
  for (const { category, slug, subCategories } of CATEGORY_TREE) {
    for (const subCategory of subCategories) {
      test(
        `selects ${category} › ${subCategory} and reflects it in the breadcrumb`,
        { tag: Tags.REGRESSION },
        async ({ categoryPage }) => {
          await categoryPage.goto(slug);
          await categoryPage.selectCategory(subCategory);
          await expect(categoryPage.title).toHaveText(subCategory);
          await expect(categoryPage.breadcrumbLink(category)).toBeVisible();
          await expect(categoryPage.breadcrumbCurrent).toHaveText(subCategory);
        },
      );
    }
  }
});
