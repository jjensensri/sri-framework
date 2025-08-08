import styles from './footer.module.scss';

import { Col, Container, Row } from 'react-bootstrap';

// todo: cms
import menus from '@app/data/footer.json';

const { COMPANY_NAME, SITE_NAME } = process.env;

export const Footer = async () => {
  const copyrightName = COMPANY_NAME || SITE_NAME || '';
  const copyrightDate = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <Row>
          {menus.map((menu, index) => (
            <Col xs={12} md={4} className={styles['links-and-address']} key={`menu-${index}`}>
              <h2 className={`h4`}>{menu.title}</h2>
              <ul>
                {menu.items.map((item) => {
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
