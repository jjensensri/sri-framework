import { ProductTile } from '@components/layout/product-tile';
import type { Product } from '@lib/catalog-api/types';
import styles from '@components/layout/product-carousel/product-carousel.module.scss';
import { Carousel, CarouselItem, Col, Container, Row } from 'react-bootstrap';

export const ProductCarousel = async ({
  perSlide,
  products,
}: {
  perSlide?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number };
  products: Product[];
}) => {
  if (!products?.length) return null;

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  // TODO: delete
  const carouselProducts = [...products, ...products, ...products];

  const sizes = `
    (min-width: 1400px) ${perSlide?.xxl ? 100 / perSlide.xxl : '25'}vw
    (min-width: 1200px) ${perSlide?.xl ? 100 / perSlide.xl : '25'}vw
    (min-width: 992px) ${perSlide?.lg ? 100 / perSlide.lg : 100 / 3}vw
    (min-width: 768px) ${perSlide?.md ? 100 / perSlide.md : '50'}vw
    (min-width: 576px) ${perSlide?.sm ? 100 / perSlide.sm : '100'}vw
    ${perSlide?.xs ? 100 / perSlide?.xs : '100'}vw
  `;

  console.log('carouselProducts', carouselProducts);

  return (
    <section className={styles['product-carousel']}>
      <div className={styles['product-carousel-wrapper']}>
        {/*TODO: delete*/}
        {/*{products.map((product) => {*/}
        {carouselProducts.map((product, index) => {
          return (
            <div
              key={`${product.handle}-${index}`}
              className={`${styles['product-carousel-item']} animate-fade-in`}
            >
              <ProductTile product={product} sizes={sizes} />
            </div>
          );
        })}
      </div>
    </section>
  );
};
