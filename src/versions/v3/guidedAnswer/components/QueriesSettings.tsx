import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import RemoveSVG from '@ui/atoms/icons/Remove-16.svg';
import AISVG from '@ui/atoms/icons/AI-24.svg';
import EditSVG from '@ui/atoms/icons/Edit-16.svg';
import SearchSVG from '@ui/atoms/icons/Search-16.svg';
import CloseSVG from '@ui/atoms/icons/Close-12.svg';
import EmptySearchSVG from '@ui/atoms/icons/EmptySearch-72.svg';
import { InputTextarea } from '@ui/components/inputs/InputTextarea';
import { ColumnFlex, RowFlex } from '@ui/components/Flex';
import { ButtonAdd } from '@ui/components/buttons/ButtonAdd';
import { Notification } from '@ui/components/notifications';
import { ButtonMinimal } from '@ui/components/buttons/ButtonMinimal';
import { TooltipIcon } from '@ui/components/Tooltip/TooltipIcon';
import TooltipStyles from '@ui/components/Tooltip/_shared/Tooltip.styles';
import { useContentWrapRef } from '@ui/components/dialogs/_shared/ContentWrapRefContext';
import produce from 'immer';
import { uuidv4 } from '@stonlyCommons/helpers/randomValues';
import { GenerateQueriesDropdown } from './GenerateQueriesDropdown';
import { LanguageSelector } from './LanguageSelector';

/**
 * V3 fork of QueriesSettings — redesigned per Figma node 5170:17602 ("Modal default"), shared by
 * both AddAnswerDialog (Step 2 of 2) and EditAnswerDialog's Queries tab, so every change here
 * applies to both flows:
 * - The old bordered InputSelect language dropdown is replaced by a plain-button LanguageSelector
 *   (globe icon + language name + chevron, opens a search-filterable list) — see
 *   LanguageSelector.tsx, built on the real @stonly/design-system package.
 * - A normal (always-visible, not collapsed-to-icon) search field and the LanguageSelector share
 *   their own row — a StickyToolbar (node 5172:20943) pinned to the top of the modal's scrollable
 *   content area, so both stay reachable while a long query list scrolls beneath them. Its bottom
 *   divider only appears once scrolled (same convention as ActionsDialog's own header divider —
 *   see DialogHeader — reused here via the same ContentWrapRefContext). "Queries (N)" — N being
 *   the current language's own query count — is a separate content-level section label
 *   underneath, not sharing a row with either control.
 * - Each row's icon (AI-16 for generated, Edit-16 for manual) sits INSIDE the input field
 *   itself — inset top-left, with the field's own left padding pushed over to make room — instead
 *   of as a separate element before it. A row's ai/manual status is derived, not stored: it's AI
 *   only while its text still matches what was generated — the moment a human edits it away from
 *   that, it becomes a manual row (keyboard icon) permanently, with no separate "revert to AI"
 *   affordance.
 * - A newly-added language with zero queries has no special empty-state treatment — it just looks
 *   like starting from scratch for that language (no rows, "+ Add query"/"Generate queries" right
 *   there), even if other languages already have queries. There's deliberately no "Auto-Translate
 *   from {other language}" CTA — every language's queries are typed/generated independently.
 * - "Generate queries" is an inline dropdown trigger next to "+ Add query" (see
 *   GenerateQueriesDropdown), not a separate always-open panel or a nested modal.
 * - After a generate batch lands, the list smooth-scrolls to the first new row and pulses a green
 *   highlight on every row in that batch for 1.6s — same color/duration/easing as the Shallow Copy
 *   app's own post-action highlight (ContentRow.css `.content-row--highlight` /
 *   `content-row-highlight-flash`), for consistency across the user's own projects.
 */
const highlightPulse = keyframes`
  0% { background-color: #ddf3e8; }
  100% { background-color: transparent; }
`;

// Hover fills the whole row (padding + negative margin so it extends past the row's own content
// without shifting layout/alignment with siblings), like the row-hover treatment in the AI Agent
// Assist app's Recommendation filters screen — a flat gray wash behind the row, with the input's
// own white bordered box staying crisp on top of it, not a border-color change on the field
// itself. The highlight pulse reuses this exact padded shape (same radius/inset), just green
// instead of gray, so a freshly-generated batch reads as a coherent set of rows.
const AnimatedQueryRow = styled(motion.div)<{ $highlighted?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  padding: 8px;
  margin: -8px;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.color.backgroundDefaultHover};
  }

  ${({ $highlighted }) =>
    $highlighted &&
    css`
      animation: ${highlightPulse} 1.6s ease-out;
    `}
`;

// Wraps the field so its icon can be inset inside the bordered box (top-left, per Figma) instead
// of living outside it — the field's own left padding is pushed over to 40px (12px icon inset +
// 16px icon + 12px gap, matching the Figma "Content" x-position) so typed text never runs under it.
const QueryFieldWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;

  textarea {
    padding-left: 40px !important;
  }
`;

const QueryFieldIcon = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  z-index: 1;

  > * {
    flex-shrink: 0;
  }
`;

// Same convention as V2: a small icon (hover: "AI-generated query").
const AiIcon = styled(AISVG)`
  width: 16px;
  height: 16px;
  flex: none;

  /* Per the icon-atom convention (Figma "Atoms" file, node 3892:35613): neutral gray, same as
     ManualQueryIcon below — iconDefault at rest, iconHover on hover/focus — not a fixed pink
     indicator. !important since TooltipIcon's TriggerIconWrapper hardcodes its own rest/hover/
     focus fill for the generic "?" help-icon case (a more specific "wrapper svg path" selector). */
  path {
    fill: ${({ theme }) => theme.color.iconDefault} !important;
  }

  ${TooltipStyles.TriggerIconWrapper}:hover &,
  ${TooltipStyles.TriggerIconWrapper}:focus & {
    path {
      fill: ${({ theme }) => theme.color.iconHover} !important;
    }
  }

  /* TooltipIcon's TriggerIconWrapper also bakes in a 4px left margin (meant for a "?" help icon
     sitting right after label text), which has no place here sitting flush inside the field. */
  margin-left: 0 !important;
`;

// Manually-typed rows — and AI-generated rows a human has since edited away from their original
// text — get the same hover-tooltip treatment as the AI icon ("User-typed query"). Per Figma atom
// node 2489:501 ("Basic / Edit-16"): a pen/edit glyph, fill-based like AiIcon, so this only needs
// to force its own default/hover fill (this Edit-16 asset is also used elsewhere in the app with
// a legacy #515358 fill baked in, so the color is overridden here rather than edited in the shared
// file). Same default/hover convention already established for this row's icons: iconDefault at
// rest, iconHover on hover — the hover swap keys off TriggerIconWrapper's own hover state (not
// this icon's) since that wrapping span is what the pointer is actually over.
const ManualQueryIcon = styled(EditSVG)`
  width: 16px;
  height: 16px;
  flex: none;

  /* Same fix as AiIcon: TooltipIcon's TriggerIconWrapper bakes in a 4px left margin (meant for a
     "?" help icon after label text), which doesn't apply sitting flush inside the field. */
  margin-left: 0 !important;

  path {
    fill: ${({ theme }) => theme.color.iconDefault} !important;
  }

  ${TooltipStyles.TriggerIconWrapper}:hover &,
  ${TooltipStyles.TriggerIconWrapper}:focus & {
    path {
      fill: ${({ theme }) => theme.color.iconHover} !important;
    }
  }
`;

// "Queries (N)" — a content-level section label now (per Figma), not the modal's own title; see
// AddAnswerDialog's "Step X of 2" header for what replaced it there. The count is the current
// language's own query count, so it re-reads the moment the language (or the list) changes.
const SectionLabel = styled.span`
  ${({ theme }) => theme.typography.h3Strong};
  color: ${({ theme }) => theme.color.textDark};
`;

// Pins the search + language row to the top of the modal's scrollable content area — this
// component's nearest scrolling ancestor is ActionsDialog's own DialogContent (`overflow: auto`,
// no top padding), so `top: 0` docks it flush against the viewport the instant it would otherwise
// scroll out of view. A solid background keeps rows scrolling underneath from showing through the
// gaps around the search field/language button; z-index keeps it above those rows once stuck.
// The bottom divider only appears once scrolled — same pattern as DialogHeader's own top divider —
// so it reads as "content sliding under the toolbar" rather than a divider that's always there.
const StickyToolbar = styled.div<{ $showDivider?: boolean }>`
  position: sticky;
  top: 0;
  z-index: 2;
  background: ${({ theme }) => theme.color.backgroundDefault};
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.backgroundDefault};

  ${({ $showDivider, theme }) =>
    $showDivider &&
    css`
      border-bottom-color: ${theme.color.borderSubtle};
    `}
`;

// A normal, always-visible search field — same Dropdown-box convention as the query row inputs
// (border-default, radius 4, h-40, 12px padding) — sized and laid out per Figma node 5172:20947
// ("Text input"), not a collapsed-to-icon control.
const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 200px;
  height: 40px;
  flex: none;
  border: 1px solid ${({ theme }) => theme.color.borderDefault};
  border-radius: 4px;
  padding: 0 12px;

  svg {
    flex: none;
  }
`;

const SearchInputField = styled.input`
  border: none;
  outline: none;
  background: none;
  flex: 1;
  min-width: 0;
  padding: 0;
  ${({ theme }) => theme.typography.uiElement};
  color: ${({ theme }) => theme.color.textDefault};

  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }
`;

// A plain-text input has no native clear affordance, so this stands in for one — a custom icon
// instead of the browser's own `type="search"` cancel button, whose color/appearance isn't
// reliably stylable across browsers (and rendered with an unwanted blue tint here). Same
// default/hover icon-color convention as the rest of this file's icon buttons.
const CloseSearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;

  svg {
    width: 12px;
    height: 12px;
  }

  path {
    fill: ${({ theme }) => theme.color.iconSubtle};
  }

  &:hover path {
    fill: ${({ theme }) => theme.color.iconDefault};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.borderFocus};
    outline-offset: 2px;
  }
`;

// Per Figma node 5178:22727 ("empty-search" illustration + copy), centered in place of the row
// list when a search filters the current language's queries down to zero.
const NoSearchResultsState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 24px 0;

  svg {
    flex: none;
  }
`;

const NoSearchResultsText = styled.p`
  margin: 0;
  ${({ theme }) => theme.typography.uiElement};
  color: ${({ theme }) => theme.color.textSubtle};
  text-align: center;
  white-space: pre-line;
`;

const queryRowMotionProps = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.2 },
};

const HIGHLIGHT_DURATION_MS = 1500;

export const QUERY_LIMIT = 500;
export const QUERY_MAX_LENGTH = 250;

export interface QueriesByLanguage {
  [language: string]: { [key: string]: string };
}

interface QueriesSettingsProps {
  queriesByLanguage: QueriesByLanguage;
  onQueriesChange: (data: { queriesByLanguage: QueriesByLanguage; counterDiff: number; idsToRemove?: string[] }) => void;
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
  languageList: string[];
  /** id -> original generated text, for every query that was AI-generated and still reads exactly
   * as generated. A row's ai/manual status is derived by comparing the current text against this,
   * not stored separately, so it can never drift out of sync — the moment a human edits the text
   * away from it, the row becomes "manual" (keyboard icon) permanently. */
  aiOriginalTextById?: { [id: string]: string };
  /** Threads through to GenerateQueriesDropdown, rendered inline next to "+ Add query". */
  isCustomMessageType: boolean;
  intentDescription: string;
  onIntentDescriptionChange: (intentDescription: string) => void;
  onAddGeneratedQueries: (queryTextListByLanguage: { [language: string]: string[] }) => void;
}

export const QueriesSettings = ({
  queriesByLanguage,
  onQueriesChange,
  currentLanguage,
  setCurrentLanguage,
  languageList,
  aiOriginalTextById = {},
  isCustomMessageType,
  intentDescription,
  onIntentDescriptionChange,
  onAddGeneratedQueries,
}: QueriesSettingsProps) => {
  const { t } = useTranslation();
  // Ids currently pulsing the "just added" highlight.
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isToolbarDividerVisible, setIsToolbarDividerVisible] = useState(false);
  const contentWrapRef = useContentWrapRef();
  const listRef = useRef<HTMLDivElement>(null);
  const previousLanguageRef = useRef(currentLanguage);
  const previousQueryIdsRef = useRef<Set<string>>(new Set(Object.keys(queriesByLanguage[currentLanguage] || {})));
  // Ids added via the plain "+ Add query" button — excluded from the "new batch" scroll/highlight,
  // which is reserved for a generated batch landing all at once.
  const manualAddIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!languageList.includes(currentLanguage)) {
      setCurrentLanguage(languageList[0]);
    }
  }, [currentLanguage, languageList, setCurrentLanguage]);

  // Same detection DialogHeader itself uses for its own top divider: only show the toolbar's
  // bottom divider once the modal's shared scroll container has actually scrolled.
  useEffect(() => {
    const scrollableElement = contentWrapRef?.current;
    if (!scrollableElement) return undefined;
    const onScroll = () => setIsToolbarDividerVisible(scrollableElement.scrollTop > 1);
    scrollableElement.addEventListener('scroll', onScroll);
    return () => scrollableElement.removeEventListener('scroll', onScroll);
  }, [contentWrapRef]);

  const { isLimitReached, isError, queries } = useMemo(() => {
    const queriesToReturn = queriesByLanguage[currentLanguage] || {};
    return {
      queries: queriesToReturn,
      isLimitReached: Object.keys(queriesToReturn).length === QUERY_LIMIT,
      isError: Object.values(queriesToReturn).some(query => query.length > QUERY_MAX_LENGTH),
    };
  }, [queriesByLanguage, currentLanguage]);

  const visibleQueryIdList = useMemo(() => {
    const allIdList = Object.keys(queries);
    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (!normalizedSearch) return allIdList;
    return allIdList.filter(id => queries[id].toLowerCase().includes(normalizedSearch));
  }, [queries, searchQuery]);

  // Detects a freshly-landed generate batch (new ids since last render, on the same language,
  // that weren't just added manually) and smooth-scrolls + pulses it. Skips entirely on a
  // language switch, where every id in view is "new" relative to the previous language's set.
  useEffect(() => {
    const currentIds = new Set(Object.keys(queries));
    const languageChanged = previousLanguageRef.current !== currentLanguage;
    if (!languageChanged) {
      const newIds = [...currentIds].filter(
        id => !previousQueryIdsRef.current.has(id) && !manualAddIdsRef.current.has(id)
      );
      if (newIds.length > 0) {
        // An active search filter could hide some (or all) of a freshly-generated batch, and
        // would break the scrollIntoView below outright if it hides the very first new row —
        // clearing it is what makes "Generate queries" usable while searching, not just clickable.
        setSearchQuery('');
        setHighlightedIds(new Set(newIds));
        requestAnimationFrame(() => {
          listRef.current?.querySelector(`[data-query-id="${newIds[0]}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      }
    }
    previousLanguageRef.current = currentLanguage;
    previousQueryIdsRef.current = currentIds;
    manualAddIdsRef.current.forEach(id => {
      if (!currentIds.has(id)) manualAddIdsRef.current.delete(id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries, currentLanguage]);

  useEffect(() => {
    if (highlightedIds.size === 0) return undefined;
    const timer = setTimeout(() => setHighlightedIds(new Set()), HIGHLIGHT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [highlightedIds]);

  const onAddQuery = () => {
    const newId = uuidv4();
    manualAddIdsRef.current.add(newId);
    onQueriesChange({
      // currentLanguage may not have a key yet — e.g. a custom-message language whose row never
      // fired a language-change event (its <select> was already correct from the initial bootstrap).
      queriesByLanguage: produce(queriesByLanguage, draft => {
        if (!draft[currentLanguage]) {
          draft[currentLanguage] = {};
        }
        draft[currentLanguage][newId] = '';
      }),
      counterDiff: 1,
    });
    // An active search filter would otherwise hide this brand-new (empty) row immediately —
    // clearing it here is what makes "+ Add query" usable while searching, not just clickable.
    setSearchQuery('');
  };

  const onRemoveQuery = (id: string) => {
    onQueriesChange({
      queriesByLanguage: produce(queriesByLanguage, draft => {
        delete draft[currentLanguage][id];
      }),
      counterDiff: -1,
      idsToRemove: [id],
    });
  };

  const onChangeQuery = (id: string, value: string) => {
    onQueriesChange({
      queriesByLanguage: produce(queriesByLanguage, draft => {
        draft[currentLanguage][id] = value;
      }),
      counterDiff: 0,
    });
  };

  return (
    <>
      <StickyToolbar data-cy="queriesToolbar" $showDivider={isToolbarDividerVisible}>
        <RowFlex justifyContent="space-between" alignItems="center">
          <SearchField data-cy="querySearchField">
            <SearchSVG />
            <SearchInputField
              type="text"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder={t('AiSources.GuidedAnswers.V3.SearchQueriesPlaceholder')}
              aria-label={t('AiSources.GuidedAnswers.V3.SearchQueriesPlaceholder')}
            />
            {searchQuery && (
              <CloseSearchButton
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={t('Global.Close')}
                data-cy="closeSearchButton"
              >
                <CloseSVG />
              </CloseSearchButton>
            )}
          </SearchField>
          <LanguageSelector languageList={languageList} currentLanguage={currentLanguage} onChangeLanguage={setCurrentLanguage} />
        </RowFlex>
      </StickyToolbar>
      <ColumnFlex gap={3}>
        <ColumnFlex gap={2}>
          <SectionLabel>
            {t('AiSources.GuidedAnswers.V3.QueriesSectionTitle', { count: Object.keys(queries).length })}
          </SectionLabel>
          {isError && (
            <Notification severity="error" data-cy="guidedAiAnswerQueriesError">
              {t('AiSources.GuidedAnswers.QueriesErrorMessage')}
            </Notification>
          )}
          {Object.keys(queries).length > 0 && (
            <ColumnFlex gap={2} ref={listRef}>
              {searchQuery.trim() && visibleQueryIdList.length === 0 ? (
                <NoSearchResultsState data-cy="noSearchResultsMessage">
                  <EmptySearchSVG />
                  <NoSearchResultsText>{t('AiSources.GuidedAnswers.V3.NoSearchResults')}</NoSearchResultsText>
                </NoSearchResultsState>
              ) : (
                <AnimatePresence initial={false}>
                  {visibleQueryIdList.map(id => {
                    const query = queries[id];
                    const hasError = query.length > QUERY_MAX_LENGTH;
                    // Derived, not stored: comparing the current text against the remembered
                    // original is what lets a row flip to "manual" the moment a human edits it away
                    // from what AI generated (or back, if the edit is undone by hand).
                    const originalText = aiOriginalTextById[id];
                    const isAiGenerated = originalText !== undefined && query.trim() === originalText.trim();
                    return (
                      <AnimatedQueryRow
                        key={id}
                        data-query-id={id}
                        $highlighted={highlightedIds.has(id)}
                        {...queryRowMotionProps}
                      >
                        <QueryFieldWrap>
                          <InputTextarea
                            data-cy="queryInput"
                            value={query}
                            onChangeValue={value => onChangeQuery(id, value)}
                            placeholder={t('AiSources.GuidedAnswers.QueryPlaceholder')}
                            minRows={1}
                            status={hasError ? 'error' : undefined}
                            message={
                              hasError
                                ? t('AiSources.GuidedAnswers.QueryLengthError', {
                                    length: query.length,
                                    maxLength: QUERY_MAX_LENGTH,
                                  })
                                : undefined
                            }
                          />
                          <QueryFieldIcon>
                            {isAiGenerated ? (
                              <TooltipIcon as={AiIcon}>{t('AiSources.GuidedAnswers.AiGeneratedQueryTooltip')}</TooltipIcon>
                            ) : (
                              <TooltipIcon as={ManualQueryIcon}>
                                {t('AiSources.GuidedAnswers.V3.UserTypedQueryTooltip')}
                              </TooltipIcon>
                            )}
                          </QueryFieldIcon>
                        </QueryFieldWrap>
                        <ButtonMinimal
                          iconOnly={<RemoveSVG />}
                          onClick={() => onRemoveQuery(id)}
                          data-cy="removeQueryButton"
                        />
                      </AnimatedQueryRow>
                    );
                  })}
                </AnimatePresence>
              )}
              {isLimitReached && (
                <Notification severity="warning" data-cy="guidedAiAnswerQueriesLimit">
                  {t('AiSources.GuidedAnswers.QueriesLimitMessage', { limit: QUERY_LIMIT })}
                </Notification>
              )}
            </ColumnFlex>
          )}
        </ColumnFlex>
        <RowFlex gap={3} alignItems="center">
          <ButtonAdd onClick={onAddQuery} data-cy="addQueryButton" disabled={isLimitReached}>
            {t('AiSources.GuidedAnswers.V2.AddQueryButton')}
          </ButtonAdd>
          <GenerateQueriesDropdown
            currentLanguage={currentLanguage}
            languageList={languageList}
            isCustomMessageType={isCustomMessageType}
            existingQueryList={Object.values(queries)}
            onAddQueries={onAddGeneratedQueries}
            intentDescription={intentDescription}
            onIntentDescriptionChange={onIntentDescriptionChange}
          />
        </RowFlex>
      </ColumnFlex>
    </>
  );
};
