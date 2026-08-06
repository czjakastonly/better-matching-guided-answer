import styled from 'styled-components';
import ExternalSourcesSVG from '@ui/atoms/icons/ExternalSources-24.svg';
import AiAgentSVG from '@ui/atoms/icons/AiAgent-24.svg';
import AiProfileSVG from '@ui/atoms/icons/AiProfile-24.svg';
import GuidedResponseSVG from '@ui/atoms/icons/GuidedResponse-24.svg';
import CustomInstructionsSVG from '@ui/atoms/icons/CustomInstructions-24.svg';
import SettingsSVG from '@ui/atoms/icons/Settings-24.svg';

export const ExternalSourcesIcon = styled(ExternalSourcesSVG)`
  path {
    fill: ${props => props.theme.color.iconDefault};
  }
`;
export const AiAgentIcon = styled(AiAgentSVG)`
  path {
    fill: ${props => props.theme.color.iconDefault};
  }
`;

export const AiProfileIcon = styled(AiProfileSVG)`
  path {
    fill: ${props => props.theme.color.iconDefault};
  }
`;

export const GuidedResponseIcon = styled(GuidedResponseSVG)`
  path {
    fill: ${props => props.theme.color.iconDefault};
  }
`;

export const CustomInstructionsIcon = styled(CustomInstructionsSVG)`
  path {
    fill: ${props => props.theme.color.iconDefault};
  }
`;

export const SettingsIcon = styled(SettingsSVG)`
  path {
    fill: ${props => props.theme.color.iconDefault};
  }
`;
