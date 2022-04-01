import { MetaMaskService } from '@core/wallet/metamask';
import { setLoggedIn, useAppDispatch, useAppSelector } from 'store';
import { RepositoryFactory } from '@repositories/RepositoryFactory';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const wallet = useAppSelector((state) => state.app.wallet);

  const signIn = async () => {
    if (!wallet.isconnected) {
      router.push('/wallet');
      return;
    }

    await MetaMaskService.signIn();
    dispatch(setLoggedIn({ value: true }));
  };

  const logOut = async () => {
    try {
      await RepositoryFactory.get('auth').logout();
      localStorage.setItem('WALLET_DISCONNECTED', '1');
      await router.push('/');

      dispatch(setLoggedIn({ value: false, resetWallet: true }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return {
    signIn,
    logOut,
  };
};
