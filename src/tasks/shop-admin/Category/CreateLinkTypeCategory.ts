import { test as base, Locator } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import { CategoryData, CategoryCustomizableLinkData } from '../../../types/ShopwareTypes';

export const CreateLinkTypeCategory = base.extend<{ CreateLinkTypeCategory: Task }, FixtureTypes>({
  CreateLinkTypeCategory: async ({ AdminCategories, AdminCategoryDetail, TestDataService }, use) => {

    const task = (categoryData: CategoryData, categoryCustomizableLinkData: CategoryCustomizableLinkData, parentCategoryName: string) => {
      return async function CreateLinkTypeCategory() {
        await AdminCategories.getTreeItemContextButton(parentCategoryName).click();
        await AdminCategories.page.getByText('New category after').click();
        await AdminCategories.createCategoryInput.fill(categoryData.name);
        await AdminCategories.confirmCategoryCreationButton.click();
        await AdminCategories.fadingBar.first().waitFor({ state: 'hidden' });
        await AdminCategories.confirmCategoryCancelButton.click();
        await AdminCategories.categoryItems.filter({ hasText: categoryData.name }).click();
        await AdminCategories.nameInput.fill(categoryData.name);
        await AdminCategories.activeCheckbox.setChecked(categoryData.status);
        await AdminCategories.categoryTypeSelectionList.click();
        await AdminCategories.filtersResultPopoverItemList.filter({ hasText: categoryData.categoryType }).click();
        await AdminCategories.linkTypeSelectionList.click();
        await AdminCategories.filtersResultPopoverItemList.filter({ hasText: categoryCustomizableLinkData.linkType }).click();
        await AdminCategories.entitySelectionList.click();
        await AdminCategories.filtersResultPopoverItemList.filter({ hasText: categoryCustomizableLinkData.entity }).click();

        let locator: Locator;
        switch (categoryCustomizableLinkData.entity) {
          case 'Category':
            await AdminCategories.categorySelectionList.click();
            if (categoryCustomizableLinkData.category != null) {
              locator = await AdminCategories.getPopOverCategoryByName(categoryCustomizableLinkData.category);
              await locator.getByRole('checkbox').click();
            }
            break;
          case 'Product':
            await AdminCategories.productSelectionList.click();
            if (categoryCustomizableLinkData.product != null) {
              await AdminCategories.productSelectionInput.fill(categoryCustomizableLinkData.product);
            }
            await AdminCategories.filtersResultPopoverItemList.filter({ hasText: categoryCustomizableLinkData.product }).click();
            break;
          case 'Landing page':
            await AdminCategories.landingPageSelectionList.click();
            await AdminCategories.filtersResultPopoverItemList.filter({ hasText: categoryCustomizableLinkData.landingPage }).click();
            break;
          default:
            throw new Error('Entity type not found');
        }

        await AdminCategories.openInNewTabCheckbox.setChecked(categoryCustomizableLinkData.openInNewTab);
        await AdminCategories.saveButton.click();
        await AdminCategories.loadingSpinner.waitFor({ state: 'hidden' });
        const url = AdminCategoryDetail.page.url();
        const categoryId = url.split('/')[url.split('/').length - 2];
        TestDataService.addCreatedRecord('category', categoryId);
      };
    };

    await use(task);
  },
});