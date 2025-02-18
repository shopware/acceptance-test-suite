import { AdminApiContext } from "./AdminApiContext";
import { SystemConfig } from "../types/ShopwareTypes";

export class PluginConfigHelper {
    private api: AdminApiContext;
    private configs: SystemConfig[];

    constructor(api: AdminApiContext, configs: SystemConfig[]) {
        this.api = api;
        this.configs = configs;
    }

    getByKey(key: string): SystemConfig | undefined {
        return this.configs.find((config) => config.configurationKey === key);
    }

    async updateValueByKey(key: string, value: any): Promise<void> {
        const config = this.getByKey(key);
        if (!config) {
            return;
        }

        config.configurationValue = value;
        await this.api.patch('system-config/' + config.id, {
            data: {
                configurationValue: value,
                configurationKey: key,
                id: config.id,
            },
        });
    }

    async updateValues(values: Array<{ key: string, value: any }>): Promise<void> {
        for (const value of values) {
            await this.updateValueByKey(value.key, value.value);
        }
    }
}
