import { MetaMaskService } from '@core/wallet/metamask';
import { setWallet, useAppDispatch } from 'store';
import { useRouter } from 'next/router';

export const useWallet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const updateWallet = async () => {
    const isConnected = await MetaMaskService.isConnected();

    if (isConnected) {
      const [address, balance, chainId] = await Promise.all([
        MetaMaskService.getCurrentConnectedAccount(),
        MetaMaskService.getBalance(),
        MetaMaskService.getChainId(),
      ]);

      dispatch(
        setWallet({
          isInstalled: true,
          isconnected: true,
          chain: chainId as string,
          address,
          balance,
        }),
      );
    } else {
      dispatch(
        setWallet({
          isInstalled: true,
          isconnected: false,
          chain: undefined,
          address: undefined,
          balance: undefined,
        }),
      );
    }
  };

  const connectWallet = async () => {
    const success = await MetaMaskService.connect();

    if (success) {
      await updateWallet();
      router.push('/profile');
    }
  };

  return {
    updateWallet,
    connectWallet,
  };
};
