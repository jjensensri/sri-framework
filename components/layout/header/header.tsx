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
import SideCart from '@components/cart/side-cart';
import LogoIcon from '@components/icons/logo';
import Search from './search';

// todo: cms
import menu from '@app/data/header.json';

export const Header = async () => {
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
                    {menu.map((item) => (
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
          <SideCart />
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
