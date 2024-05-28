import { test as base } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import type { FixtureTypes} from '../../../types/FixtureTypes';

type ValidateAccessibilityTask = (
    pageName: string,
    assertViolations?: boolean,
    createReport?: boolean,
    ruleTags?: string[],
    outputDir?: string
) => () => Promise<void>;

export const ValidateAccessibility = base.extend<{ ValidateAccessibility: ValidateAccessibilityTask } & FixtureTypes>({
    ValidateAccessibility: async ({ ShopCustomer }, use)=> {
        const task: ValidateAccessibilityTask = (
            pageName: string,
            assertViolations = true,
            createReport = true,
            ruleTags = ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'best-practice'],
            outputDir = 'test-results/AccessibilityReports'
        ) => {
            return async function ValidateAccessibility() {

                const axeBuilder = new AxeBuilder({ page: ShopCustomer.page });

                const accessibilityResults = await axeBuilder.withTags(ruleTags).analyze();

                if (createReport) {
                    createHtmlReport({
                        results: accessibilityResults,
                        options: {
                            projectKey: pageName,
                            reportFileName: `${pageName.replace(/[^a-zA-Z]/g, '')}.html`,
                            outputDir: outputDir,
                        },
                    });
                }

                if (assertViolations) {
                    ShopCustomer.expects(accessibilityResults.violations).toEqual([]);
                }
            }
        };

        await use(task);
    },
});