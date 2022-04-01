import { useWallet } from '@hooks/wallet';

const Wallet = () => {
  const { connectWallet } = useWallet();

  return (
    <div className="row">
      <div className="col-lg-3 mb30">
        <span className="box-url" onClick={connectWallet}>
          <span className="box-url-label">Most Popular</span>
          <img src="./img/wallet/1.png" alt="" className="mb20" />
          <p>
            Start exploring blockchain applications in seconds. Trusted by over 1 million users
            worldwide.
          </p>
        </span>
      </div>
    </div>
  );
};
export default Wallet;
