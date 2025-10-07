import { test, expect } from '../../src';

test('page and context are the same as AdminPage and AdminPage.context()', async ({
    page,
    AdminPage,
    context,
}) => {
    expect(page).toBe(AdminPage);
    expect(context).toBe(AdminPage.context());

});