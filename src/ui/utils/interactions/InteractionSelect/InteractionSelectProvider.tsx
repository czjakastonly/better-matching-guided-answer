import React, { useMemo } from 'react';

export const InteractionSelectContext = React.createContext<{ selectedValue?: string | string[] }>({});

/**
 *
 *
 *
 * Interaction SELECT
 *
 * It's not any kind of interaction yet, but naming consistent with other ListBox-like functionalities
 *
 * A provider that keeps data about some sort of selection (selectedValue may be a string or an array of strings)
 * And then on interactionSelectItem component we have access to 'isSelected' property what can be easily used
 * to show/hide proper styling.
 *
 * Check <ListBox> or _shared/interaction.stories for live examples
 *
 *
 * FUTURE: when needed, some sort of callbacks like toggle and onChangeSelectedValue prop can be easily added
 *
 *
 */
export const InteractionSelectProvider = ({
  // FUTURE/multiselect - onChangeSelectedValue
  selectedValue,
  children,
}: {
  selectedValue?: string | string[];
  children: React.ReactNode;
}) => {
  return (
    <InteractionSelectContext.Provider value={useMemo(() => ({ selectedValue }), [selectedValue])}>
      {children}
    </InteractionSelectContext.Provider>
  );
};
