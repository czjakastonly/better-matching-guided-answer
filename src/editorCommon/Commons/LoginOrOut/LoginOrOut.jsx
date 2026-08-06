import React from 'react';
import styled from 'styled-components';
import useUserManagement from '@editorCommon/hooks/useUserManagement';

/** Demo stub of the editor's LoginOrOut user menu: shows the user name with a chevron. */
const Canvas = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
  color: white; font-size: 14px; cursor: pointer;
`;

const LoginOrOut = () => {
  const userManagement = useUserManagement();
  return (
    <Canvas data-cy="loginOrOut">
      {userManagement?.user?.name || 'User'}
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Canvas>
  );
};

export default LoginOrOut;
