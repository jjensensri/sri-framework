import { Price } from '@components/price';
import styles from './product-tile.module.scss';
import { Card, CardBody, CardText, CardTitle } from 'react-bootstrap';
import { Product } from '@lib/catalog-api/types';
import Image from 'next/image';
import Link from 'next/link';
import ProductTileAddToCart from '@components/layout/product-tile/product-tile-add-to-cart';

export const ProductTile = ({ product, sizes }: { product: Product; sizes: string }) => {
  return (
    <Link href={`/product/${product.handle}`} prefetch={true} className={styles['product-tile']}>
      <Card>
        <div className={styles['product-image']}>
          <Image
            src={product?.featuredImage?.url || ''}
            alt={product?.title}
            sizes={sizes}
            width={product?.featuredImage?.width}
            height={product?.featuredImage?.height}
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

          {/* todo: this is only for the default sku, need to add the rest */}
          {product?.variants?.[0]?.id && (
            <ProductTileAddToCart skuId={product.variants[0].id} quantity={1} />
          )}
        </CardBody>
      </Card>
    </Link>
  );
};

export default ProductTile;
