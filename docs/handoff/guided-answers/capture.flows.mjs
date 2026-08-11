/**
 * capture.flows.mjs — Guided answers: Add-answer + Edit-answer flow screenshots.
 * Run from inside the repo: `node docs/handoff/guided-answers/capture.flows.mjs`
 */
import { chromium } from 'playwright';
import { createSession } from '/Users/byczajka/.claude/skills/handoff/scripts/capture.mjs';

const OUT = new URL('.', import.meta.url).pathname;
const s = createSession({
  chromium,
  baseUrl: 'http://localhost:5173/',
  readySelector: '[data-stonly-trigger="guided-answers-settings-title"]',
  screensDir: OUT + 'screens',
});

const EXISTING_ANSWER_NAME = "My guide can't be saved";
const GUIDE_TITLE = 'Creating and publishing guides';

const run = async label => {
  console.log(`--- ${label} ---`);
};

async function addFlowHappyPath(browser) {
  await run('add: happy path + inline validations');
  const { ctx, page } = await s.fresh(browser, null);
  try {
    // 1 — entry
    await s.shot(page, 'add/01-list-entry');

    // 2 — open dialog, step 1 empty
    await page.locator('[data-cy="addGuidedAnswer"]').click({ force: true });
    await page.locator('[data-cy="addGuidedAnswerDialog"]').waitFor();
    await page.waitForTimeout(200);
    await s.shot(page, 'add/02-step1-empty');

    // 2b — click "Assign queries" with nothing filled -> inline validation
    await page.getByRole('button', { name: 'Assign queries' }).click({ force: true });
    await page.waitForTimeout(150);
    await s.shot(page, 'add/02b-step1-validation-error');

    // 3 — fill name, answer type, guide -> step 1 filled
    await page.locator('[data-cy="nameInput"]').fill('Cancel my subscription');
    await page.locator('[data-cy="answerType"]').click({ force: true });
    await page.getByRole('option', { name: 'Guide to load' }).click({ force: true });
    await page.locator('[data-cy="guideSelect"]').click({ force: true });
    await page.getByRole('button', { name: GUIDE_TITLE }).click({ force: true });
    await page.waitForTimeout(150);
    await s.shot(page, 'add/03-step1-filled');

    // 4 — advance to step 2 (Assign queries), empty
    await page.getByRole('button', { name: 'Assign queries' }).click({ force: true });
    await page.locator('[data-cy="queriesToolbar"]').waitFor();
    await page.waitForTimeout(200);
    await s.shot(page, 'add/04-step2-empty');

    // 4b — click "Add answer" with 0 queries -> inline validation
    await page.getByRole('button', { name: 'Add answer' }).click({ force: true });
    await page.waitForTimeout(150);
    await s.shot(page, 'add/04b-queries-validation-error');

    // 5 — open Generate-queries popover
    await page.locator('[data-cy="generateQueriesTrigger"]').click({ force: true });
    await page.locator('[data-cy="generateQueriesPopover"]').waitFor();
    await page.waitForTimeout(150);
    await s.shot(page, 'add/05-generate-popover');

    // 5b — click "Generate" with the intent field still empty -> inline validation
    await page.locator('[data-cy="generateActionButton"]').click({ force: true });
    await page.waitForTimeout(150);
    await s.shot(page, 'add/05b-intent-required-error');

    // 6 — fill intent, generate -> queries land + highlight
    await page
      .locator('[data-cy="intentDescriptionInput"]')
      .fill("When the user wants to cancel or stop paying for their subscription");
    await page.locator('[data-cy="generateActionButton"]').click({ force: true });
    await page.locator('[data-query-id]').first().waitFor({ timeout: 5000 });
    await page.waitForTimeout(150);
    await s.shot(page, 'add/06-generated-queries');

    // 6b — edit one generated query's text (icon flips AI -> pen/edit, since it no longer reads
    // exactly as generated) and manually add another (also pen/edit, from the start)
    await page.locator('[data-query-id]').first().locator('textarea').fill('How can I cancel my plan? (edited)');
    await page.locator('[data-cy="addQueryButton"]').click({ force: true });
    await page.locator('[data-query-id]').last().locator('textarea').fill('Where do I go to cancel?');
    await page.waitForTimeout(150);
    await s.shot(page, 'add/06b-manual-and-edited-queries');

    // 6c — switch language: French has no queries yet (nothing generated/typed there so far)
    await page.locator('[data-cy="languageSelector"]').click({ force: true });
    await page.getByRole('option', { name: 'French' }).click({ force: true });
    await page.waitForTimeout(200);
    await s.shot(page, 'add/06c-language-switch-empty');

    // 6d — generate for French only: "Add to all languages" stays unchecked, so this batch
    // targets just the currently-selected language instead of every language at once
    await page.locator('[data-cy="generateQueriesTrigger"]').click({ force: true });
    await page.locator('[data-cy="generateQueriesPopover"]').waitFor();
    await page.locator('[data-cy="intentDescriptionInput"]').fill('Quand un utilisateur veut annuler son abonnement');
    await page.locator('[data-cy="generateActionButton"]').click({ force: true });
    await page.locator('[data-query-id]').first().waitFor({ timeout: 5000 });
    await page.waitForTimeout(150);
    await s.shot(page, 'add/06d-generate-per-language');

    // 6e — search for a term that matches nothing -> empty-state illustration + copy, in place of
    // the row list (the search field itself lives in the sticky toolbar, next to the language
    // selector; it's a normal always-visible text input now, not a collapsed icon toggle)
    await page.locator('[data-cy="querySearchField"] input').fill('zzz-no-match');
    await page.locator('[data-cy="noSearchResultsMessage"]').waitFor();
    await page.waitForTimeout(150);
    await s.shot(page, 'add/06e-search-no-results');
    await page.locator('[data-cy="querySearchField"] input').fill('');

    // 7 — submit -> success (dialog closes, row appears)
    await page.getByRole('button', { name: 'Add answer' }).click({ force: true });
    await page.locator('[data-cy="addGuidedAnswerDialog"]').waitFor({ state: 'detached', timeout: 5000 });
    await page.getByText('Cancel my subscription', { exact: true }).waitFor();
    await page.waitForTimeout(200);
    await s.shot(page, 'add/07-success');

    console.log('ok add: happy path');
  } catch (e) {
    console.log('FAIL add: happy path', e.message);
  } finally {
    await ctx.close();
  }
}

async function addFlowExitConfirm(browser) {
  await run('add: exit-confirmation branch');
  const { ctx, page } = await s.fresh(browser, null);
  try {
    await page.locator('[data-cy="addGuidedAnswer"]').click({ force: true });
    await page.locator('[data-cy="addGuidedAnswerDialog"]').waitFor();
    await page.locator('[data-cy="nameInput"]').fill('Draft answer, not finished');
    await page.waitForTimeout(150);

    // 8 — cancel with unsaved changes -> exit-confirmation dialog
    await page.getByRole('button', { name: 'Cancel' }).click({ force: true });
    await page.waitForTimeout(150);
    await s.shot(page, 'add/08-exit-confirm');

    // 9 — discard -> back to the (unchanged) list
    await page.getByRole('button', { name: 'Discard changes' }).click({ force: true });
    await page.locator('[data-cy="addGuidedAnswerDialog"]').waitFor({ state: 'detached', timeout: 5000 });
    await page.waitForTimeout(150);
    await s.shot(page, 'add/09-discarded');

    console.log('ok add: exit-confirmation branch');
  } catch (e) {
    console.log('FAIL add: exit-confirmation branch', e.message);
  } finally {
    await ctx.close();
  }
}

async function openEditDialogForSeedRow(page) {
  const row = page.locator('tr[data-cy="tableRow"]', {
    has: page.locator('[data-cy="sourceName"]', { hasText: EXISTING_ANSWER_NAME }),
  });
  await row.locator('[data-cy="sourceOptions"] button').click({ force: true });
  await page.getByRole('option', { name: 'Edit' }).click({ force: true });
  await page.locator('[data-cy="editGuidedAnswerDialog"]').waitFor();
}

async function editFlowHappyPath(browser) {
  await run('edit: happy path + inline validation');
  const { ctx, page } = await s.fresh(browser, null);
  try {
    // 1 — row menu open
    const row = page.locator('tr[data-cy="tableRow"]', {
      has: page.locator('[data-cy="sourceName"]', { hasText: EXISTING_ANSWER_NAME }),
    });
    await row.locator('[data-cy="sourceOptions"] button').click({ force: true });
    await page.waitForTimeout(150);
    await s.shot(page, 'edit/01-row-menu');

    // 2 — Edit dialog, Answer tab (prefilled)
    await page.getByRole('option', { name: 'Edit' }).click({ force: true });
    await page.locator('[data-cy="editGuidedAnswerDialog"]').waitFor();
    await page.waitForTimeout(200);
    await s.shot(page, 'edit/02-answer-tab');

    // 2b — clear the required name field, try to save -> inline validation
    const nameInput = page.locator('[data-cy="nameInput"]');
    await nameInput.fill('');
    await page.getByRole('button', { name: 'Save changes' }).click({ force: true });
    await page.waitForTimeout(150);
    await s.shot(page, 'edit/02b-name-validation-error');
    await nameInput.fill(EXISTING_ANSWER_NAME);

    // 3 — Queries tab, existing queries loaded
    await page.locator('[data-cy="tabLabel"]', { hasText: 'Queries' }).click({ force: true });
    await page.locator('[data-cy="queriesToolbar"]').waitFor();
    await page.waitForTimeout(250);
    await s.shot(page, 'edit/03-queries-tab');

    // 4 — generate more queries via the same dropdown
    await page.locator('[data-cy="generateQueriesTrigger"]').click({ force: true });
    await page.locator('[data-cy="generateQueriesPopover"]').waitFor();
    await page
      .locator('[data-cy="intentDescriptionInput"]')
      .fill('When the user asks why their changes disappeared after closing the editor');
    await page.locator('[data-cy="generateActionButton"]').click({ force: true });
    await page.waitForTimeout(1700);
    await s.shot(page, 'edit/04-generate');

    // 5 — Settings tab
    await page.locator('[data-cy="tabLabel"]', { hasText: 'Settings' }).click({ force: true });
    await page.waitForTimeout(200);
    await s.shot(page, 'edit/05-settings-tab');

    // 6 — save -> success
    await page.getByRole('button', { name: 'Save changes' }).click({ force: true });
    await page.locator('[data-cy="editGuidedAnswerDialog"]').waitFor({ state: 'detached', timeout: 5000 });
    await page.waitForTimeout(200);
    await s.shot(page, 'edit/06-success');

    console.log('ok edit: happy path');
  } catch (e) {
    console.log('FAIL edit: happy path', e.message);
  } finally {
    await ctx.close();
  }
}

async function editFlowExitConfirm(browser) {
  await run('edit: exit-confirmation branch');
  const { ctx, page } = await s.fresh(browser, null);
  try {
    await openEditDialogForSeedRow(page);
    await page.locator('[data-cy="nameInput"]').fill(`${EXISTING_ANSWER_NAME} (draft edit)`);
    await page.waitForTimeout(150);

    // 7 — cancel with changes -> exit-confirmation dialog. Once open, the edit dialog's own
    // secondary button *also* reads "Discard changes" (it flips from "Cancel" once hasAnyChanges
    // is true) — both buttons match by accessible name, so the confirmation popup's own button
    // (rendered after, i.e. topmost) is the last match.
    await page.getByRole('button', { name: 'Discard changes' }).click({ force: true });
    await page.waitForTimeout(150);
    await s.shot(page, 'edit/07-exit-confirm');

    // 8 — discard -> row unchanged
    await page.getByRole('button', { name: 'Discard changes' }).last().click({ force: true });
    await page.locator('[data-cy="editGuidedAnswerDialog"]').waitFor({ state: 'detached', timeout: 5000 });
    await page.waitForTimeout(150);
    await s.shot(page, 'edit/08-discarded');

    console.log('ok edit: exit-confirmation branch');
  } catch (e) {
    console.log('FAIL edit: exit-confirmation branch', e.message);
  } finally {
    await ctx.close();
  }
}

(async () => {
  const browser = await s.launch();
  await addFlowHappyPath(browser);
  await addFlowExitConfirm(browser);
  await editFlowHappyPath(browser);
  await editFlowExitConfirm(browser);
  await browser.close();
  console.log('done');
})();
