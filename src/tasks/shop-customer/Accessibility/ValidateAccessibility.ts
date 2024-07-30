import { test as base } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import type { Result } from 'axe-core';

type ValidateAccessibilityTask = (
    pageName: string,
    assertViolations?: boolean | number,
    createReport?: boolean,
    ruleTags?: string[],
    outputDir?: string
) => () => Promise<Result[]>;

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

                // Exclude symfony toolbar from analysis.
                axeBuilder.exclude('.sf-toolbar');

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

                if (typeof assertViolations === 'number') {
                    ShopCustomer.expects(accessibilityResults.violations.length).toBeLessThanOrEqual(assertViolations);
                } else if (assertViolations) {
                    ShopCustomer.expects(accessibilityResults.violations).toEqual([]);
                }

                return accessibilityResults.violations;
            }
        };

        await use(task);
    },
});