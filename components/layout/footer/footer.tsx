import styles from './footer.module.scss';

import { Col, Container, Row } from 'react-bootstrap';
import { getMenu } from '@lib/shopify';
import { Menu } from '@lib/shopify/types';

const { COMPANY_NAME, SITE_NAME } = process.env;

export const Footer = async () => {
  const menuShop = await getMenu('next-js-frontend-footer-menu-shop');
  const menuHelp = await getMenu('next-js-frontend-footer-menu-help');
  const menuLegal = await getMenu('next-js-frontend-footer-menu-legal');
  const menus = [menuShop, menuHelp, menuLegal];
  const menuTitles = ['Shop', 'Help', 'Legal'];
  const copyrightName = COMPANY_NAME || SITE_NAME || '';
  const copyrightDate = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <Row>
          {menus.map((menu, index) => (
            <Col xs={12} md={4} className={styles['links-and-address']} key={`menu-${index}`}>
              <h2 className={`h4`}>{menuTitles[index]}</h2>
              <ul>
                {menu.map((item: Menu) => {
                  return (
                    <li key={item.title}>
                      <a href={item.path}>{item.title}</a>
                    </li>
                  );
                })}
              </ul>
            </Col>
          ))}
        </Row>
        <Row>
          <Col>
            <div className={styles.copyright}>
              &copy; {copyrightDate} {copyrightName}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
