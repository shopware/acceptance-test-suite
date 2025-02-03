import type { Locator, Page } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { satisfies } from 'compare-versions';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';

export class FlowBuilderCreate implements PageObject {

    //header
    public readonly saveButton: Locator;
    public readonly header: Locator;
    public readonly smartBarHeader: Locator;
    //tabs
    public readonly generalTab: Locator;
    public readonly flowTab: Locator;
    //../general
    public readonly nameField: Locator;
    public readonly descriptionField: Locator;
    public readonly priorityField: Locator;
    public readonly activeSwitch: Locator;
    //../flow
    public readonly triggerSelectField: Locator;
    public readonly modalAddButton: Locator;
    public readonly sequenceSelectorConditionButton: Locator;
    public readonly conditionSelectField: Locator;
    public readonly sequenceSelectorActionButton: Locator;
    public readonly actionSelectField: Locator;
    public readonly selectFieldResultList: Locator;
    public readonly trueBlockAddConditionButton: Locator;
    public readonly trueBlockAddActionButton: Locator;
    public readonly trueBlockActionSelectField: Locator;
    public readonly trueBlockActionDescription: Locator;
    public readonly mailSendModal: Locator;
    public readonly mailSendModalTemplateSelectField: Locator;
    public readonly falseBlockAddConditionButton: Locator;
    public readonly falseBlockAddActionButton: Locator;
    public readonly falseBlockActionSelectField: Locator;
    public readonly falseBlockActionDescription: Locator;
    public readonly tagModal: Locator;
    public readonly tagModalTagsSelectField: Locator;
    public readonly delayCard: Locator;
    public readonly conditionRule: Locator;
    public readonly sequenceSeparator: Locator;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.saveButton = page.locator('.sw-flow-detail__save');
        this.header = page.locator('h2');
        this.smartBarHeader = page.locator('.smart-bar__header');
        this.generalTab = page.locator('.sw-flow-detail__tab-general');
        this.triggerSelectField = page.locator('.sw-flow-detail-flow__trigger-card').getByRole('textbox');
        if (satisfies(instanceMeta.version, '<6.7')) {
            this.flowTab = page.locator('.sw-tabs__content').locator('.sw-flow-detail__tab-flow');
            this.modalAddButton = page.locator('.sw-button--primary').getByText('Add action');
        } else {
            this.flowTab = page.locator('.mt-tabs').locator('.mt-tabs__item').getByText('Flow');
            this.modalAddButton = page.locator('.mt-button--primary').getByText('Add action');
        }
        this.nameField = page.locator('.sw-flow-detail-general__general-name').getByLabel('Name');
        this.descriptionField = page.locator('.sw-flow-detail-general__general-description').getByLabel('Description');
        this.priorityField = page.locator('.sw-flow-detail-general__general-priority').getByLabel('Priority');
        this.activeSwitch = page.locator('.sw-flow-detail-general__general-active').getByLabel('Active');
        this.sequenceSelectorConditionButton = page.locator('.sw-flow-sequence-selector__actions').getByText('Add condition (IF)');
        this.conditionSelectField = page.locator('.sw-flow-sequence-condition__select');
        this.conditionRule = page.locator('.sw-flow-sequence-condition__rule-header');
        this.sequenceSelectorActionButton = page.locator('.sw-flow-sequence-selector__actions').getByText('Add action (THEN)');
        this.actionSelectField = page.locator('.sw-flow-sequence-action__content').locator('.sw-single-select__selection');
        this.selectFieldResultList = page.locator('.sw-select-result-list__item-list');
        this.trueBlockAddConditionButton = page.locator('.sw-flow-sequence__true-block').getByText('Add condition (IF)');
        this.trueBlockAddActionButton = page.locator('.sw-flow-sequence__true-block').getByText('Add action (THEN)');
        this.trueBlockActionSelectField = page.locator('.sw-flow-sequence__true-block').locator('.sw-single-select');
        this.trueBlockActionDescription = page.locator('.sw-flow-sequence__true-block').locator('.sw-flow-sequence-action__action-description');
        this.mailSendModal = page.locator('.sw-flow-mail-send-modal');
        this.mailSendModalTemplateSelectField = page.locator('.sw-flow-mail-send-modal').locator('.sw-entity-single-select__selection');
        this.falseBlockAddConditionButton = page.locator('.sw-flow-sequence__false-block').getByText('Add condition (IF)');
        this.falseBlockAddActionButton = page.locator('.sw-flow-sequence__false-block').getByText('Add action (THEN)');
        this.falseBlockActionSelectField = page.locator('.sw-flow-sequence__false-block').locator('.sw-single-select');
        this.falseBlockActionDescription = page.locator('.sw-flow-sequence__false-block').locator('.sw-flow-sequence-action__actions');
        this.tagModal = page.locator('.sw-flow-tag-modal');
        this.tagModalTagsSelectField = page.locator('.sw-flow-tag-modal').locator('.sw-select__selection').getByLabel('Tags');
        this.delayCard = page.locator('.sw-flow-delay-action__delay_card');
        this.sequenceSeparator = page.locator('.sw-flow-detail-flow__position-connection');
    }
    url() {
        return '#/sw/flow/create/general';
    }
    async getSelectedTrigger(): Promise<string> {
        await this.page.locator('.sw-flow-detail-flow__trigger-card').getByRole('textbox').hover();
        const tooltip = await this.page.waitForSelector('.sw-tooltip');
        return await tooltip.innerText();
    }
}