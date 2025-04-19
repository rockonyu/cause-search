import { expect, test } from "@playwright/test";
import { search } from "./mocks/organizations";
import { pageSecond } from "./mocks/organizations/page-second";

test("檢查標題", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("所有捐款項目")).toBeVisible();
});

test("測試 tabs 元件", async ({ page }) => {
  await page.goto("/");

  await page.getByText("捐款專案").click();
  await expect(page.getByText("projects")).toBeVisible();
  await page.getByText("義賣商品").click();
  await expect(page.getByText("products")).toBeVisible();
});

test("切換搜尋模式", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "search" }).click();
  await expect(
    page.getByRole("textbox", { name: "請輸入關鍵字" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "取消" })).toBeVisible();

  await page.getByRole("button", { name: "取消" }).click();
  await expect(page.getByRole("button", { name: "search" })).toBeVisible();
});

test("測試 search 元件", async ({ page }) => {
  await page.goto("/");

  await page.route("/api/organizations*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(search),
    }),
  );

  await page.getByRole("button", { name: "search" }).click();
  await page.getByRole("textbox", { name: "請輸入關鍵字" }).click();
  await page.getByRole("textbox", { name: "請輸入關鍵字" }).fill("q");
  await expect(
    page.getByRole("heading", { name: "Prosacco Inc" }),
  ).toBeVisible();
});

test("測試無限滾動", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Champlin, McLaughlin and Kilback" }),
  ).toBeVisible();

  await page.route("/api/organizations*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(pageSecond),
    }),
  );

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(
    page.getByRole("heading", { name: "O'Kon - Stehr" }),
  ).toBeAttached();
});
