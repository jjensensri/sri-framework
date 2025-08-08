import { ProductCarousel } from '@components/layout/product-carousel';
import { ProductGrid } from '@components/layout/product-grid';
import { getCollectionProducts } from '@lib/catalog-api';
import { Col, Container, Row } from 'react-bootstrap';

export const metadata = {
  title: 'Cart API Demo Storefront',
  description: 'Stone Rooster e-commerce framework',
  openGraph: {
    type: 'website',
  },
};

const HomePage = async () => {
  const allProducts = (await getCollectionProducts('all-products')) || [];
  const nikeSneakers = (await getCollectionProducts('nike-sneakers')) || [];
  const reebokSneakers = (await getCollectionProducts('reebok-sneakers')) || [];

  const gridProducts = [
    ...allProducts,
    ...nikeSneakers,
    ...reebokSneakers,
    ...nikeSneakers,
    ...reebokSneakers,
    ...allProducts,
  ];
  const carouselProducts = [
    ...allProducts,
    ...nikeSneakers,
    ...reebokSneakers,
    ...nikeSneakers,
    ...reebokSneakers,
    ...allProducts,
  ];

  return (
    <>
      {/* sample product grid */}
      <Container>
        <Row>
          <Col>
            <h2>Product Grid</h2>
            <p>
              This is a sample product grid. You can pass in the number of items you want per row at
              each breakpoint.
            </p>
          </Col>
        </Row>
      </Container>
      <ProductGrid products={gridProducts} />

      {/* sample product carousel */}
      <Container>
        <Row>
          <Col>
            <h2>Product Carousel</h2>
            <p>
              This is a sample product carousel. You can pass in the number of items you want per
              slide at each breakpoint.
            </p>
          </Col>
        </Row>
      </Container>
      <ProductCarousel products={carouselProducts} />
    </>
  );
};

export default HomePage;
