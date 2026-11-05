import { test, expect, type APIResponse } from "../../src";

test("Cleanup deletes promotions before the persona rules they reference", async ({ TestDataService, AdminApiContext, IdProvider }) => {
    const rule = await TestDataService.createBasicRule({}, { type: "customerIsNewsletterRecipient", value: { isNewsletterRecipient: true } });
    const promotion = await TestDataService.createPromotionWithConditionRule({
        id: IdProvider.getIdPair().uuid,
        name: `Persona Rule Promotion ${rule.id}`,
        ruleId: rule.id,
    });

    await test.step("Clean up deletes the promotion and its persona rule", async () => {
        const cleanUpResponse = (await TestDataService.cleanUp()) as APIResponse;
        expect(cleanUpResponse.ok()).toBeTruthy();

        const promotionResponse = await AdminApiContext.get(`promotion/${promotion.id}`);
        expect(promotionResponse.status()).toBe(404);

        const ruleResponse = await AdminApiContext.get(`rule/${rule.id}`);
        expect(ruleResponse.status()).toBe(404);
    });
});
