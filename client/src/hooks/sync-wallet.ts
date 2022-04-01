import { useWallet } from './wallet';
import { MetaMaskService } from '@core/wallet/metamask';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch, setLoggedIn } from 'store';
import { RepositoryFactory } from '@repositories/RepositoryFactory';
import { useRouter } from 'next/router';

// Only use this one time at root component
export const useSyncWallet = () => {
  const { updateWallet } = useWallet();
  const wallet = useAppSelector((state) => state.app.wallet);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    updateWallet();
  }, []);

  useEffect(() => {
    if (MetaMaskService.ethereum) {
      const ethereum = MetaMaskService.ethereum;
      ethereum.on('accountsChanged', async (accounts: number[]) => {
        const account = accounts[0];

        await updateWallet();

        if (account) {
          try {
            await router.push('/');
            setTimeout(async () => {
              await RepositoryFactory.get('auth').logout();
              dispatch(setLoggedIn({ value: false }));
            }, 1000);
          } catch (e) {
            console.error(e);
          }
        }
      });
      ethereum.on('chainChanged', updateWallet);
    }

    return () => {
      if (MetaMaskService.ethereum) {
        const ethereum = MetaMaskService.ethereum;
        ethereum.removeListener('accountsChanged', updateWallet);
        ethereum.removeListener('chainChanged', updateWallet);
      }
    };
  }, [wallet]);
};
