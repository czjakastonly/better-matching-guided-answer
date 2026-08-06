import styled from 'styled-components';

import StonlyLogoSVG from 'resources/logo/logoWhite.svg';

export const Canvas = styled.div`
  display: flex;
  background: ${({ theme }) => theme.mainColor};
  align-items: center;
  height: 52px;
  color: white;
  font-size: 14px;
  /* padding-top: 24px; */
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  padding-left: 24px;
  /* padding-top: 4px; */
`;

export const Right = styled.div`
  margin-left: auto;
  margin-right: 24px;
  font-size: inherit;
`;

export const Menu = styled.div`
  display: flex;
  margin-left: 24px;
  font-size: inherit;
  line-height: 1;
  font-weight: 500;
`;

export const SiteLogo = styled(StonlyLogoSVG)`
  width: 107px;
`;
