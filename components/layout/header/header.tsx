import styles from './header.module.scss';
import {
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarOffcanvas,
  NavbarToggle,
  NavLink,
  OffcanvasBody,
  OffcanvasHeader,
  OffcanvasTitle,
} from 'react-bootstrap';
import CartModal from '@components/cart/modal';
import { getMenu } from '@lib/shopify';
import { Menu } from '@lib/shopify/types';
import LogoIcon from '@components/icons/logo';
import Search from './search';
import { headers } from 'next/headers';

const { SITE_NAME } = process.env;

export const Header = async () => {
  const menu = await getMenu('next-js-frontend-header-menu');

  const headerList = await headers();
  const pathname = headerList.get('x-current-path') || '';

  console.log('pathname: ', pathname);

  return (
    <header className={styles.header}>
      <Navbar expand="md" collapseOnSelect>
        <Container>
          <div className={styles['logo-container']}>
            <NavbarToggle />
            <NavbarBrand href="/">
              <LogoIcon />
            </NavbarBrand>
          </div>
          <NavbarCollapse>
            <NavbarOffcanvas placement="start">
              <OffcanvasHeader closeButton>
                <OffcanvasTitle>Menu</OffcanvasTitle>
              </OffcanvasHeader>
              <OffcanvasBody className="justify-content-start">
                {menu.length ? (
                  <Nav as="ul">
                    {menu.map((item: Menu) => (
                      <li key={item.title}>
                        <NavLink href={item.path}>{item.title}</NavLink>
                      </li>
                    ))}
                  </Nav>
                ) : null}
              </OffcanvasBody>
            </NavbarOffcanvas>
          </NavbarCollapse>
          <Search />
          <CartModal />
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
