import { test, expect } from "@playwright/test";
import { TestDataService, IdProvider } from "../../src";
import type { AdminApiContext } from "../../src/services/AdminApiContext";
import type { SalesChannel } from "../../src";

function makeService(borrowedSalesChannel: boolean) {
    const calls: { method: string; path: string; data?: unknown }[] = [];
    const response = { ok: () => true, json: async () => ({ data: {} }) };
    const api = Object.fromEntries(
        ["post", "patch", "delete"].map((method) => [
            method,
            async (path: string, options?: { data?: unknown }) => {
                calls.push({ method, path, data: options?.data });
                return response;
            },
        ])
    ) as unknown as AdminApiContext;
    const service = new TestDataService(api, {} as IdProvider, {
        borrowedSalesChannel,
        defaultSalesChannel: { id: "borrowed-channel" } as SalesChannel,
        defaultTaxId: "tax",
        defaultCurrencyId: "currency",
        defaultCategoryId: "category",
        defaultLanguageId: "language",
        defaultCountryId: "country",
        defaultCustomerGroupId: "group",
    });
    return { service, calls };
}

test("borrowed-channel configuration and analytics fail before any mutation", async () => {
    const { service, calls } = makeService(true);
    await expect(service.setSystemConfig({ "core.cart.test": true })).rejects.toThrow("borrowed sales channel");
    await expect(service.assignSalesChannelAnalytics("borrowed-channel", "analytics")).rejects.toThrow("borrowed sales channel");
    expect(() => service.addCreatedSalesChannelRecord("borrowed-channel", "analyticsId")).toThrow("borrowed sales channel");
    expect(calls).toEqual([]);
});

test("cleanup never deletes a registered borrowed sales channel", async () => {
    const { service, calls } = makeService(true);
    service.addCreatedRecord("sales_channel", "borrowed-channel");
    await expect(service.cleanUp()).rejects.toThrow("borrowed sales channel");
    expect(calls).toEqual([]);
});

test("unused borrowed data service does not clear caches or write during cleanup", async () => {
    const { service, calls } = makeService(true);
    await service.cleanUp();
    expect(calls).toEqual([]);
});

test("cleanup deletes explicitly created data without resetting the borrowed channel", async () => {
    const { service, calls } = makeService(true);
    service.addCreatedRecord("product", "owned-product");
    await service.cleanUp();
    expect(calls.find((call) => call.path === "_action/sync")?.data).toEqual({ "delete-product": { entity: "product", action: "delete", payload: [{ id: "owned-product" }] } });
    expect(calls.some((call) => call.method === "patch" || call.path.includes("system-config"))).toBe(false);
});

test("generated channels retain configuration and cleanup behavior", async () => {
    const { service, calls } = makeService(false);
    await service.setSystemConfig({ "core.cart.test": true });
    await service.cleanUp();
    expect(calls.filter((call) => call.path.includes("system-config")).map((call) => call.data)).toEqual([{ "core.cart.test": true }, { "core.cart.test": null }]);
});
