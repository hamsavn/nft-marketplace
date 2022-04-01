import Link from 'next/link';

interface Props {
  to: string;
  onClick?: () => void;
}

export const NavLink: React.FC<Props> = (props) => (
  <Link href={props.to} passHref>
    <a onClick={props.onClick}>{props.children}</a>
  </Link>
);
