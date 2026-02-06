import { type AdminApiContext } from "./AdminApiContext";

export const clearDelayedCache = async (adminApiContext: AdminApiContext): Promise<void> => {
    await adminApiContext.delete("./_action/cache-delayed");
};
