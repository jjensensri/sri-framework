'use client';

import { Button } from 'react-bootstrap';
import { addItem } from '@components/cart/actions';

export const ProductTileAddToCart = ({ skuId, quantity }: { skuId: string; quantity: number }) => {
  return (
    <Button
      variant={'primary'}
      className={`rounded-pill`}
      onClick={(e) => {
        e.preventDefault();
        addItem(null, { skuId, quantity }).then();
      }}
    >
      Add to cart
    </Button>
  );
};

export default ProductTileAddToCart;
