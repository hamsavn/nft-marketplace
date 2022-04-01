import { useEffect, useState } from 'react';
import { BreakpointProvider, setDefaultBreakpoints, Breakpoint } from 'react-socks';
import useOnclickOutside from 'react-cool-onclickoutside';
import { NavLink } from './NavLink';
import { useAppDispatch, useAppSelector, setLoggedIn } from 'store';
import { useRouter } from 'next/router';
import { getFileUrl } from '@lib/get-file-url';
import { useDebouncedCallback } from 'use-debounce';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useAuth } from '@hooks/auth';
import { Address } from '@components/Address';

setDefaultBreakpoints([{ xs: 0 }, { l: 1199 }, { xl: 1200 }]);

const DEFAULT_AVATAR = 'https://storage.googleapis.com/opensea-static/opensea-profile/18.png';

interface Props {
  className?: string;
}

const Header: React.FC<Props> = ({ className }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { logOut } = useAuth();

  const { address, balance, isconnected } = useAppSelector((state) => state.app.wallet);
  const user = useAppSelector((state) => state.app.user);

  const [openMenu1, setOpenMenu1] = useState(false);

  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
  };

  const closeMenu1 = () => {
    setOpenMenu1(false);
  };

  const ref1 = useOnclickOutside(() => {
    closeMenu1();
  });

  const [showmenu, btn_icon] = useState(false);
  const [showpop, btn_icon_pop] = useState(false);

  const closePop = () => {
    btn_icon_pop(false);
  };

  const refpop = useOnclickOutside(() => {
    closePop();
  });

  useEffect(() => {
    const header = document.getElementById('myHeader');
    const totop = document.getElementById('scroll-to-top');

    if (!header || !totop) {
      return;
    }

    const sticky = header.offsetTop;

    const onScroll = () => {
      btn_icon(false);

      if (window.pageYOffset > sticky) {
        header.classList.add('sticky');
        totop.classList.add('show');
      } else {
        header.classList.remove('sticky');
        totop.classList.remove('show');
      }
      if (window.pageYOffset > sticky) {
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const onSearch = useDebouncedCallback((value: string) => {
    router.replace({
      pathname: '/nft',
      query: {
        ...router.query,
        search: value,
      },
    });
  }, 300);

  const copyAddress = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success('Address Copied');
  };

  return (
    <header className={`navbar white ${className} `} id="myHeader" style={{}}>
      <div className="container">
        <div className="row w-100-nav">
          <div className="logo px-0">
            <div className="navbar-title navbar-item">
              <NavLink to="/">
                <img src="/img/logo.png" className="img-fluid d-block" alt="#" />
                <img src="/img/logo-2.png" className="img-fluid d-3" alt="#" />
                <img src="/img/logo-3.png" className="img-fluid d-4" alt="#" />
                <img src="/img/logo-light.png" className="img-fluid d-none" alt="#" />
              </NavLink>
            </div>
          </div>

          <div className="search">
            <input
              id="quick_search"
              className="xs-hide"
              name="quick_search"
              placeholder="Search items here..."
              type="text"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          <BreakpointProvider>
            <Breakpoint l down>
              {showmenu && (
                <div className="menu">
                  <Link href="/">
                    <div className="navbar-item">
                      <div>
                        <div className="dropdown-custom btn">
                          Home
                          <span className="lines"></span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link href="/nft">
                    <div className="navbar-item">
                      <div>
                        <div className="dropdown-custom btn">
                          Explore
                          <span className="lines"></span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </Breakpoint>

            <Breakpoint xl>
              <div className="menu">
                <Link href="/">
                  <div className="navbar-item">
                    <div>
                      <div className="dropdown-custom btn">
                        Home
                        <span className="lines"></span>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link href="/nft">
                  <div className="navbar-item">
                    <div>
                      <div className="dropdown-custom btn">
                        Explore
                        <span className="lines"></span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </Breakpoint>
          </BreakpointProvider>

          <div className="mainside">
            {!isconnected && (
              <div className="connect-wal" style={{ display: 'block' }}>
                <NavLink to="/wallet">Connect Wallet</NavLink>
              </div>
            )}

            {isconnected && (
              <div>
                <div
                  className="logout"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <NavLink to="/mint">Create</NavLink>

                  <div
                    id="de-click-menu-profile"
                    className="de-menu-profile"
                    onClick={() => btn_icon_pop(!showpop)}
                    ref={refpop}
                  >
                    <img
                      src={getFileUrl(getFileUrl(user?.profileImage) || DEFAULT_AVATAR)}
                      alt=""
                      style={{ height: 38 }}
                    />
                    {showpop && (
                      <div className="popshow">
                        <div className="d-name">
                          <h4 className="name" style={{ color: '#ff343f' }}>
                            {user?.userName}
                          </h4>
                        </div>

                        <div className="d-balance">
                          <h4>Balance</h4>
                          {balance.toFixed(5)} ETH
                        </div>
                        <div className="d-wallet">
                          <h4>My Wallet</h4>
                          <span id="wallet" className="d-wallet-address">
                            <Address address={address} />
                          </span>
                          <button
                            id="btn_copy"
                            title="Copy Text"
                            onClick={() => copyAddress(address)}
                          >
                            Copy
                          </button>
                        </div>

                        <>
                          <div className="d-line"></div>
                          <ul className="de-submenu-profile">
                            <li
                              onClick={() => {
                                router.push('/profile');
                              }}
                            >
                              <span>
                                <i className="fa fa-user"></i> My profile
                              </span>
                            </li>
                            <li
                              onClick={() => {
                                router.push(`/author/${address}`);
                              }}
                            >
                              <span>
                                <i className="fa fa-list"></i> My collections
                              </span>
                            </li>
                            <li onClick={logOut}>
                              <span>
                                <i className="fa fa-sign-out"></i> Sign out
                              </span>
                            </li>
                          </ul>
                        </>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
          <div className="menu-line white"></div>
          <div className="menu-line1 white"></div>
          <div className="menu-line2 white"></div>
        </button>
      </div>
    </header>
  );
};
export default Header;
