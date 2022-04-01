import { MetaMaskInpageProvider } from '@metamask/providers';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { RepositoryFactory } from '@repositories/RepositoryFactory';

function utf8ToHex(str: string) {
  const buf = Buffer.from(str, 'utf8');
  return buf.toString('hex');
}
declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    contract: any;
  }
}

class MetaMask {
  provider: ethers.providers.Web3Provider;
  ethereum: any;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.ethereum = window.ethereum;
      this.provider = new ethers.providers.Web3Provider(window.ethereum as any);
    }
  }

  isInstalled(): boolean {
    return Boolean(window.ethereum);
  }

  async isConnected(): Promise<boolean> {
    if (!this.isInstalled()) {
      return;
    }

    const accounts = await this.provider.send('eth_accounts', []);

    return accounts && accounts.length > 0 && !localStorage.getItem('WALLET_DISCONNECTED');
  }

  async connect(): Promise<boolean> {
    try {
      if (!this.isInstalled()) {
        throw new Error('Need download MetaMask');
      }

      await this.provider.send('eth_requestAccounts', []);

      localStorage.removeItem('WALLET_DISCONNECTED');

      return true;
    } catch (e) {
      toast.error(e.message);
      return false;
    }
  }

  async signIn() {
    const connected = await this.isConnected();

    if (!connected) {
      const result = await this.connect();
      if (!result) {
        return;
      }
    }

    const address = await this.getCurrentConnectedAccount();

    if (address) {
      const nonce = await RepositoryFactory.get('auth').getNonce(address);

      const data = await window.ethereum.request({
        method: 'personal_sign',
        params: [utf8ToHex(nonce), address],
      });

      await RepositoryFactory.get('auth').createAuth({
        address,
        signature: data as string,
      });
    }
  }

  /**
   * Get balance of this addres (ether)
   * @returns {Number}
   */
  async getBalance() {
    const address = await this.getCurrentConnectedAccount();
    return Number(ethers.utils.formatEther(await this.provider.getBalance(address)));
  }

  /**
   * Return connected address at 0 index if it exsit
   * @returns {string}
   */
  async getCurrentConnectedAccount() {
    const addresses: string[] = await this.provider.send('eth_accounts', []);
    return addresses[0];
  }

  async getChainId() {
    return window.ethereum.request({ method: 'eth_chainId' });
  }
}

export const MetaMaskService = new MetaMask();
