import { type AdminApiContext } from './AdminApiContext';

export const isSaaSInstance = async (adminApiContext: AdminApiContext): Promise<boolean> => {
    const instanceFeatures = await adminApiContext.get('./instance/features');
    return instanceFeatures.ok();
};