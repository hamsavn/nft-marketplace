import { useAppDispatch, useAppSelector, fetchUser } from 'store';
import { StyledHeader } from '@styled/styles';
import { useEffect } from 'react';
import { useSyncWallet } from '@hooks/sync-wallet';

interface Props {}

export const ClientWrapper: React.FC<Props> = ({ children }) => {
  const loggedIn = useAppSelector((state) => state.app.loggedIn);
  const wallet = useAppSelector((state) => state.app.wallet);
  const distpach = useAppDispatch();

  useSyncWallet();

  useEffect(() => {
    distpach(fetchUser(wallet.address || ''));
  }, [wallet.address, loggedIn]);

  const theme = loggedIn ? 'GREYLOGIN' : 'GREY';

  return (
    <>
      <StyledHeader theme={theme} />
      {children}
    </>
  );
};
