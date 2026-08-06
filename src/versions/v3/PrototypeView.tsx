import React from 'react';

import { GuidedAnswers } from './guidedAnswer/GuidedAnswers';
import { DEMO_TEAM_ID, PrototypeShell } from '../shared/PrototypeShell';

/** Version 3 — forked from V2, see versions/v3/guidedAnswer. Diverges from V2 in the Queries tab
 * only: the "Generate from intent" card is a "Generate queries" dropdown trigger next to
 * "+ Add query" instead of an always-open card, and the language selector is always visible
 * (matches Figma node 5155:9729, "Modal default") instead of hidden for single-language answers. */
export const PrototypeViewV3 = () => (
  <PrototypeShell>
    <GuidedAnswers teamId={DEMO_TEAM_ID} />
  </PrototypeShell>
);
