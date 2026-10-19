import { test, expect, type APIResponse } from "../../src";

test("Cleanup deletes orders that have documents", async ({ TestDataService, AdminApiContext }) => {
    const product = await TestDataService.createBasicProduct();
    const customer = await TestDataService.createCustomer();
    const order = await TestDataService.createOrder([{ product, quantity: 1 }], customer);

    await test.step("Create an invoice and a dependent cancellation invoice for the order", async () => {
        const invoiceResponse = await AdminApiContext.post("_action/order/document/invoice/create", {
            data: [{ orderId: order.id }],
        });
        expect(invoiceResponse.ok()).toBeTruthy();
        const { data: invoices } = (await invoiceResponse.json()) as { data: { documentId: string }[] };

        const cancellationResponse = await AdminApiContext.post("_action/order/document/storno/create", {
            data: [{ orderId: order.id, referencedDocumentId: invoices[0].documentId }],
        });
        expect(cancellationResponse.ok()).toBeTruthy();
    });

    await test.step("Clean up deletes the documents and the order", async () => {
        const cleanUpResponse = (await TestDataService.cleanUp()) as APIResponse;
        expect(cleanUpResponse.ok()).toBeTruthy();

        const documentResponse = await AdminApiContext.post("search/document", {
            data: { filter: [{ type: "equals", field: "orderId", value: order.id }] },
        });
        expect(documentResponse.ok()).toBeTruthy();
        const { total } = (await documentResponse.json()) as { total: number };
        expect(total).toBe(0);

        const orderResponse = await AdminApiContext.get(`order/${order.id}`);
        expect(orderResponse.status()).toBe(404);
    });
});
