/**
 * capture.specs.mjs — Guided answers: component blueprints (measured specs + crops).
 * Run from inside the repo: `node docs/handoff/guided-answers/capture.specs.mjs`
 */
import { chromium } from 'playwright';
import { createSpecSession } from '/Users/byczajka/.claude/skills/handoff/scripts/capture-specs.mjs';

const OUT = new URL('.', import.meta.url).pathname;
const s = createSpecSession({
  chromium,
  baseUrl: 'http://localhost:5173/',
  readySelector: '[data-stonly-trigger="guided-answers-settings-title"]',
  componentsDir: OUT + 'components',
  specPath: OUT + 'spec.json',
});

const GUIDE_TITLE = 'Creating and publishing guides';

(async () => {
  const browser = await s.launch();
  const { ctx, page } = await s.fresh(browser, null);

  try {
    // --- answer-settings: Step 1 of the Add-answer dialog, filled in ---
    await page.locator('[data-cy="addGuidedAnswer"]').click({ force: true });
    const addDialog = page.locator('[data-cy="addGuidedAnswerDialog"]');
    await addDialog.waitFor();
    await page.locator('[data-cy="nameInput"]').fill('Cancel my subscription');
    await page.locator('[data-cy="answerType"]').click({ force: true });
    await page.getByRole('option', { name: 'Guide to load' }).click({ force: true });
    await page.locator('[data-cy="guideSelect"]').click({ force: true });
    await page.getByRole('button', { name: GUIDE_TITLE }).click({ force: true });
    await page.waitForTimeout(200);

    await s.annotate(
      addDialog,
      [
        { label: 'Answer label', loc: page.locator('[data-cy="nameInput"]') },
        { label: 'Response type', loc: page.locator('[data-cy="answerType"]') },
        { label: 'Guide to load', loc: page.locator('[data-cy="guideSelect"]') },
        { label: 'Assign queries (primary)', loc: page.getByRole('button', { name: 'Assign queries' }) },
        { label: 'Cancel (secondary)', loc: page.getByRole('button', { name: 'Cancel' }) },
      ],
      'answer-settings',
      'AnswerSettings.tsx'
    );

    // --- queries-settings: Step 2, one AI-generated query (sparkle) + one manual (pen) —
    // side by side so the redline documents both icon states at once.
    await page.getByRole('button', { name: 'Assign queries' }).click({ force: true });
    await page.locator('[data-cy="queriesToolbar"]').waitFor();
    await page.locator('[data-cy="generateQueriesTrigger"]').click({ force: true });
    await page.locator('[data-cy="generateQueriesPopover"]').waitFor();
    await page.locator('[data-cy="intentDescriptionInput"]').fill('When the user cannot save their guide');
    await page.locator('[data-cy="generateActionButton"]').click({ force: true });
    await page.locator('[data-query-id]').first().waitFor({ timeout: 5000 });
    await page.locator('[data-cy="addQueryButton"]').click({ force: true });
    await page.locator('[data-query-id]').last().locator('textarea').fill('How do I save my guide?');
    await page.waitForTimeout(200);

    await s.annotate(
      addDialog,
      [
        { label: 'Search queries', loc: page.locator('[data-cy="querySearchField"]') },
        { label: 'Language selector', loc: page.locator('[data-cy="languageSelector"]') },
        { label: 'Queries (section, count)', loc: page.getByText(/^Queries \(\d+\)$/) },
        { label: 'Query row — AI-generated (sparkle)', loc: page.locator('[data-query-id]').first() },
        { label: 'Query row — manual/edited (pen)', loc: page.locator('[data-query-id]').last() },
        { label: 'Add query', loc: page.locator('[data-cy="addQueryButton"]') },
        { label: 'Generate queries', loc: page.locator('[data-cy="generateQueriesTrigger"]') },
      ],
      'queries-settings',
      'QueriesSettings.tsx'
    );

    // --- generate-queries-popover ---
    await page.locator('[data-cy="generateQueriesTrigger"]').click({ force: true });
    const popover = page.locator('[data-cy="generateQueriesPopover"]');
    await popover.waitFor();
    await page.waitForTimeout(150);

    await s.annotate(
      popover,
      [
        { label: 'Intent description', loc: page.locator('[data-cy="intentDescriptionInput"]') },
        { label: 'Generate (primary)', loc: page.locator('[data-cy="generateActionButton"]') },
      ],
      'generate-queries-popover',
      'GenerateQueriesDropdown.tsx'
    );

    // --- exit-confirm-dialog ---
    // Escape closes the "Generate queries" popover only, not the Add-answer dialog itself.
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Cancel' }).click({ force: true });
    await page.getByText('Exit without saving?').waitFor();
    await page.waitForTimeout(150);
    // Both the Add dialog and the exit-confirmation dialog are `[aria-modal="true"]` at this point
    // (the confirmation stacks on top, doesn't replace); it renders last, so `.last()` is it.
    const exitDialog = page.locator('[aria-modal="true"]').last();
    await s.simple(exitDialog, 'exit-confirm-dialog', 'ActionsDialog.tsx (exit-confirmation variant)');

    console.log('ok specs');
  } catch (e) {
    console.log('FAIL specs', e.message);
  } finally {
    await ctx.close();
    await browser.close();
    const p = s.save();
    console.log('WROTE', p);
  }
})();
