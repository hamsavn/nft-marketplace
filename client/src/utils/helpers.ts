import { toast } from 'react-toastify';

export const copyText = async (value: string) => {
  await navigator.clipboard.writeText(value);
  toast.success('Copied');
};
