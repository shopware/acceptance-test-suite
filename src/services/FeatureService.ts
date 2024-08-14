import { AdminApiContext } from './AdminApiContext';

interface FeatureFlag {
    default: boolean;
    major: boolean;
    toggleable: boolean;
    description: string;
    active: boolean;
}

/**
 * Service to interact with feature flags
 */
export class FeatureService {

    private readonly apiContext: AdminApiContext;
    private features: Record<string, FeatureFlag> = {};
    private resetFeatures: Record<string, boolean> = {};

    constructor(apiContext: AdminApiContext) {
        this.apiContext = apiContext;
    }

    public async enable(name: string | string[]): Promise<void> {
        if (Array.isArray(name)) {
            for (const n of name) {
                await this.enable(n);
            }
            return;
        }

        await this.loadFeatures();

        if (!this.features[name]) {
            throw new Error(`Feature flag ${name} does not exist`);
        }

        if (this.features[name].active) {
            return;
        }

        if (!this.features[name].toggleable) {
            throw new Error(`Feature flag ${name} is not toggleable`);
        }

        const req = await this.apiContext.post(`_action/feature-flag/enable/${name}`);

        if (!req.ok()) {
            throw new Error(`Could not enable feature flag ${name}`);
        }

        this.features[name].active = true;

        // We store the reset value of the feature flag
        if (this.resetFeatures[name] === undefined) {
            this.resetFeatures[name] = false;
        } else {
            // If the feature flag was reset, we don't need to reset it again
            delete this.resetFeatures[name];
        }
    }

    public async disable(name: string | string[]): Promise<void> {
        if (Array.isArray(name)) {
            for (const n of name) {
                await this.disable(n);
            }
            return;
        }

        await this.loadFeatures();

        if (!this.features[name]) {
            throw new Error(`Feature flag ${name} does not exist`);
        }

        if (!this.features[name].active) {
            return;
        }

        if (!this.features[name].toggleable) {
            throw new Error(`Feature flag ${name} is not toggleable`);
        }

        const req = await this.apiContext.post(`_action/feature-flag/disable/${name}`);

        if (!req.ok()) {
            throw new Error(`Could not disable feature flag ${name}`);
        }

        this.features[name].active = false;

        // We store the reset value of the feature flag
        if (this.resetFeatures[name] === undefined) {
            this.resetFeatures[name] = true;
        } else {
            // If the feature flag was reset, we don't need to reset it again
            delete this.resetFeatures[name];
        }
    }

    public async isEnabled(name: string): Promise<boolean> {
        await this.loadFeatures();

        return this.features[name]?.active ?? false;
    }

    private async loadFeatures(): Promise<void> {
        if (Object.keys(this.features).length > 0) {
            return;
        }

        const res = await this.apiContext.get('_action/feature-flag');

        if (!res.ok()) {
            throw new Error('Could not load feature flags');
        }

        this.features = await res.json();
    }

    public async cleanup(): Promise<void> {
        for (const [name, reset] of Object.entries(this.resetFeatures)) {
            if (reset) {
                await this.enable(name);
            } else {
                await this.disable(name);
            }
        }
    }
}