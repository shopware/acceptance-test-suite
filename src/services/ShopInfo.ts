import { type AdminApiContext } from "./AdminApiContext";
import { type StoreApiContext } from "./StoreApiContext";

export const isSaaSInstance = async (adminApiContext: AdminApiContext): Promise<boolean> => {
    const instanceStatus = await adminApiContext.get("./instance/status");
    return instanceStatus.ok();
};

export const isPaaSInstance = (): boolean => {
    return process.env.SHOPWARE_ACCEPTANCE_INSTANCE_TYPE === "paas";
};

export const isThemeCompiled = async (context: StoreApiContext, storefrontUrl: string): Promise<boolean> => {
    const response = await context.get(storefrontUrl);

    const body = (await response.body()).toString();

    const allCssUrl = body.match(/.*"(https?:\/\/.*all\.css[^"]*)".*/)?.[1];
    const storefrontJavaScriptUrl = body.match(/.*"(https?:\/\/.*\/js\/storefront\/storefront\.js[^"]*)".*/)?.[1];

    if (!allCssUrl || !storefrontJavaScriptUrl) {
        return false;
    }

    const assetResponses = await Promise.all([
        context.get(allCssUrl),
        context.get(storefrontJavaScriptUrl),
    ]);

    return assetResponses.every((assetResponse) => assetResponse.status() < 400);
};
