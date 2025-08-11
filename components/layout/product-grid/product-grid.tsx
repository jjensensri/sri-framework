import { ProductTile } from '@components/layout/product-tile';
import type { Product } from '@lib/catalog-api/types';
import { Col, Container, Row } from 'react-bootstrap';
import styles from './product-grid.module.scss';

export const ProductGrid = async ({
  perRow,
  products,
}: {
  perRow?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number };
  products: Product[];
}) => {
  const sizes = `
    (min-width: 1400px) ${perRow?.xxl ? 100 / perRow.xxl : '25'}vw
    (min-width: 1200px) ${perRow?.xl ? 100 / perRow.xl : '25'}vw
    (min-width: 992px) ${perRow?.lg ? 100 / perRow.lg : 100 / 3}vw
    (min-width: 768px) ${perRow?.md ? 100 / perRow.md : '50'}vw
    (min-width: 576px) ${perRow?.sm ? 100 / perRow.sm : '100'}vw
    ${perRow?.xs ? 100 / perRow?.xs : '100'}vw
  `;

  return (
    <section className={`${styles['product-grid']} product-grid`}>
      <Container>
        <Row
          xs={perRow?.xs || 1}
          sm={perRow?.sm || undefined}
          md={perRow?.md || 2}
          lg={perRow?.lg || 3}
          xl={perRow?.xl || 4}
          xxl={perRow?.xxl || undefined}
        >
          {!products?.length
            ? Array(12)
                .fill(0)
                .map((_, index) => {
                  return (
                    <Col key={index}>
                      <div className={`animate-pulse ${styles.skeleton}`} />
                    </Col>
                  );
                })
            : products.map((product, index) => {
                return (
                  <Col key={`${product.handle}-${index}`} className="animate-fade-in">
                    <ProductTile product={product} sizes={sizes} />
                  </Col>
                );
              })}
        </Row>
      </Container>
    </section>
  );
};
