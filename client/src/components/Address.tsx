import { copyText } from '@utils/helpers';
import { truncateAddress } from '@lib/format-address';

interface Props {
  address: string;
}

export const Address: React.FC<Props> = ({ address }) => {
  return (
    <span onClick={() => copyText(address)} style={{ cursor: 'pointer' }}>
      {truncateAddress(address, 11)}
    </span>
  );
};
