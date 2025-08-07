import type { Locator, Page } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { satisfies } from 'compare-versions';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { getSelectFieldListitem } from './modules/SelectFieldListitem';

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
    public readonly trueBlock: Locator;
    public readonly trueBlockAddConditionButton: Locator;
    public readonly trueBlockAddActionButton: Locator;
    public readonly trueBlockActionSelectField: Locator;
    public readonly trueBlockActionDescription: Locator;
    public readonly mailSendModal: Locator;
    public readonly mailSendModalTemplateSelectField: Locator;
    public readonly falseBlock: Locator;
    public readonly falseBlockAddConditionButton: Locator;
    public readonly falseBlockAddActionButton: Locator;
    public readonly falseBlockActionSelectField: Locator;
    public readonly falseBlockActionDescription: Locator;
    public readonly tagModal: Locator;
    public readonly tagModalTagsSelectField: Locator;
    public readonly delayCard: Locator;
    public readonly conditionRule: Locator;
    public readonly sequenceSeparator: Locator;
    public readonly addActionField: Locator;
    public readonly newFlowHeader: Locator;
    public readonly resultListItem: Locator;
    public readonly resultList: Locator;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.saveButton = page.locator('.sw-flow-detail__save');
        this.header = page.locator('h2');
        this.smartBarHeader = page.locator('.smart-bar__header');
        this.generalTab = page.locator('.sw-flow-detail__tab-general');
        this.triggerSelectField = page.locator('.sw-flow-detail-flow__trigger-card').getByRole('textbox');
        this.flowTab = page.locator('.sw-tabs__content').locator('.sw-flow-detail__tab-flow');
        if (satisfies(instanceMeta.version, '<6.7')) {
            this.modalAddButton = page.locator('.sw-button--primary').getByText('Add action');
        } else {
            this.modalAddButton = page.locator('.mt-button--primary').getByText('Add action');
        }
        this.nameField = page.getByLabel('Name');
        this.descriptionField = page.getByLabel('Description');
        this.priorityField = page.getByLabel('Priority');
        this.activeSwitch = page.getByLabel('Active');
        this.sequenceSelectorConditionButton = page.getByText('Add condition (IF)');
        this.conditionSelectField = page.locator('.sw-flow-sequence-condition__select');
        this.conditionRule = page.locator('.sw-flow-sequence-condition__rule-header');
        this.sequenceSelectorActionButton = page.getByText('Add action (THEN)');
        this.actionSelectField = page.locator('.sw-flow-sequence-action__content').locator('.sw-single-select__selection');
        this.selectFieldResultList = page.locator('.sw-select-result-list__item-list');
        this.trueBlock = page.locator('.sw-flow-sequence__true-block');
        this.trueBlockAddConditionButton = this.trueBlock.getByText('Add condition (IF)');
        this.trueBlockAddActionButton = this.trueBlock.getByText('Add action (THEN)');
        this.trueBlockActionSelectField = this.trueBlock.locator('.sw-single-select');
        this.trueBlockActionDescription = this.trueBlock.locator('.sw-flow-sequence-action__action-description');
        this.mailSendModal = page.locator('.sw-flow-mail-send-modal');
        this.mailSendModalTemplateSelectField = page.locator('.sw-flow-mail-send-modal').locator('.sw-entity-single-select__selection');
        this.falseBlock = page.locator('.sw-flow-sequence__false-block');
        this.falseBlockAddConditionButton = this.falseBlock.getByText('Add condition (IF)');
        this.falseBlockAddActionButton = this.falseBlock.getByText('Add action (THEN)');
        this.falseBlockActionSelectField = this.falseBlock.locator('.sw-single-select');
        this.falseBlockActionDescription = this.falseBlock.locator('.sw-flow-sequence-action__actions');
        this.tagModal = page.locator('.sw-flow-tag-modal');
        this.tagModalTagsSelectField = page.locator('.sw-flow-tag-modal').locator('.sw-select__selection').getByLabel('Tags');
        this.delayCard = page.locator('.sw-flow-delay-action__delay_card');
        this.sequenceSeparator = page.locator('.sw-flow-detail-flow__position-connection');
        this.newFlowHeader = page.getByRole('heading', { name: 'New flow' });
        this.addActionField = page.locator('.sw-flow-sequence-action__content').locator('.sw-single-select__selection');
        this.resultListItem = page.locator('.sw-select-result-list__content');
        this.resultList = page.locator('.sw-select-result-list');
    }

    url(flowId?: string, tabName = 'general') {
        if (!flowId || flowId === '') {
            return `#/sw/flow/create/${tabName}`;
        }
        return `#/sw/flow/create/${flowId}/${tabName}`;
    }

    async getSelectFieldListitem(selectField: Locator, listItem: string) {
        return getSelectFieldListitem(this.page, selectField, listItem, this.instanceMeta);
    }
}