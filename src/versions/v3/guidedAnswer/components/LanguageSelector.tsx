import React from 'react';
// V3-only: built with the real @stonly/design-system package (per explicit request), not the
// project's vendored @ui/* copy. Confirmed safe to mix with the app's existing ThemeProvider: the
// DS's own theme module (ui/theme.ts) is byte-identical in shape and palette to this project's
// vendored @ui/theme.
import {
  useFloatingDropdown,
  Popover,
  List,
  ListBody,
  ListItemStandard,
  withListBox,
  withListBoxOption,
  ButtonMinimal,
  Provider as DesignSystemProvider,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error — no .d.ts shipped for @stonly/design-system (dist is compiled JS only)
} from '@stonly/design-system';
// @ts-expect-error — see note above; no .d.ts shipped for @stonly/design-system
import LanguageSVG from '@stonly/design-system/icons/Language-16';
// @ts-expect-error — see note above; no .d.ts shipped for @stonly/design-system
import ChevronDownSVG from '@stonly/design-system/icons/TriangleArrowDown-12';
import { supportedLanguages } from '@stonlyCommons/helpers/i18n.helpers';

/**
 * V3: new language selector for the "Assign queries" screen, per Figma node 5170:17398. Per
 * follow-up review against the actual component library (file X9o3ueR8dt2fsp96eUSn4R, node
 * 4464:2892, "Minimal button" / State=Default, Size=Regular, Icon=Right) — the trigger isn't a
 * bespoke ghost button, it's this project's own `ButtonMinimal` (icon left + label + trailing
 * chevron, `isPressed` reflecting the open state), which already carries the correct
 * hover/active/disabled states from the design system rather than a hand-rolled approximation.
 * Sourced from @stonly/design-system so it's the real component, not the vendored @ui/* copy.
 *
 * Opens a plain list of the answer's languages — no search field (an answer only ever has a
 * handful of languages, so filtering isn't worth the extra UI). Same `useFloatingDropdown` +
 * `Popover` composition used elsewhere in this codebase (e.g. GenerateQueriesDropdown.tsx,
 * SourceMenuColumn.tsx) rather than the generic `Dropdown` wrapper, since that wrapper doesn't
 * expose `isOpen` to the trigger it renders (needed here to drive `isPressed`). Selecting a
 * language dynamically switches the whole queries view to it.
 */
const ListBoxList = withListBox(List);
const Option = withListBoxOption(ListItemStandard);

interface LanguageSelectorProps {
  languageList: string[];
  currentLanguage: string;
  onChangeLanguage: (language: string) => void;
}

const getLanguageName = (language: string) =>
  supportedLanguages.find(supportedLanguage => supportedLanguage.value === language)?.name || language.toUpperCase();

export const LanguageSelector = ({ languageList, currentLanguage, onChangeLanguage }: LanguageSelectorProps) => {
  const { isOpen, close, triggerProps, floatingProps } = useFloatingDropdown<HTMLButtonElement>({
    placement: 'bottom-start',
    widthPx: 240,
    minWidthRatio: 0,
    maxWidthRatio: 0,
    closingKeyList: ['Escape'],
  });

  return (
    <DesignSystemProvider>
      <ButtonMinimal
        {...triggerProps}
        iconLeft={<LanguageSVG />}
        iconRight={<ChevronDownSVG />}
        isPressed={isOpen}
        data-cy="languageSelector"
      >
        {getLanguageName(currentLanguage)}
      </ButtonMinimal>
      {isOpen && (
        <Popover {...floatingProps} isFocusLocked data-cy="languageSelectorPopover">
          <ListBoxList autoFocus>
            <ListBody>
              {languageList.map(language => (
                <Option
                  key={language}
                  label={getLanguageName(language)}
                  action={() => {
                    onChangeLanguage(language);
                    close();
                  }}
                />
              ))}
            </ListBody>
          </ListBoxList>
        </Popover>
      )}
    </DesignSystemProvider>
  );
};
