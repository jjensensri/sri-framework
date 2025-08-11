import Price from '@components/price';
import styles from './product-tile.module.scss';
import { Card, CardBody, CardText, CardTitle } from 'react-bootstrap';
import { Product } from '@lib/shopify/types';
import Image from 'next/image';
import Link from 'next/link';

export const ProductTile = ({ product, sizes }: { product: Product; sizes: string }) => {
  return (
    <Link href={`/product/${product.handle}`} prefetch={true} className={styles['product-tile']}>
      <Card>
        <div className={styles['product-image']}>
          <Image
            src={product?.featuredImage?.url || ''}
            alt={product?.title}
            sizes={sizes}
            width={1}
            height={1}
          />
        </div>
        <CardBody>
          <CardTitle>
            <Price
              amount={product?.priceRange?.maxVariantPrice?.amount}
              currencyCode={product?.priceRange?.maxVariantPrice?.currencyCode}
            />
          </CardTitle>
          <CardText>{product?.title}</CardText>
        </CardBody>
      </Card>
    </Link>
  );
};

export default ProductTile;
