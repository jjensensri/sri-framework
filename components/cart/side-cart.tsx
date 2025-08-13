'use client';

import { BsCart2 } from 'react-icons/bs';
import { Price } from '@components/price';
import { createUrl } from '@lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createCartAndSetCookie } from './actions';
import { useCart } from './cart-context';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle } from 'react-bootstrap';
import styles from './cart.module.scss';
import clsx from 'clsx';

export default function SideCart() {
  const { cart, cartQuantity } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const quantityRef = useRef(cartQuantity);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // todo: if you restart your server, the cart is null, but if you refresh the page it populates
  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie().then();
    }
  }, [cart]);

  // open side cart when item is added
  useEffect(() => {
    const currentQty = cart?.lineItems
      ?.flatMap((i) => i.quantity)
      .reduce((total, currentValue) => total + currentValue, 0);
    if (currentQty && currentQty !== quantityRef.current && currentQty > 0) {
      if (!isCartOpen) {
        openCart();
      }
      quantityRef.current = currentQty;
    }
  }, [cart, quantityRef]);

  return (
    <div>
      <Button className={styles['side-cart-toggle']} variant={'outline-light'} onClick={openCart}>
        <BsCart2 />
        <div className={styles['cart-quantity']}>{cartQuantity}</div>
      </Button>

      <Offcanvas show={isCartOpen} onHide={closeCart} placement={'end'}>
        <OffcanvasHeader className={styles['side-cart-header']} closeButton>
          <OffcanvasTitle>My Cart ({cartQuantity})</OffcanvasTitle>
        </OffcanvasHeader>
        <OffcanvasBody className={styles['side-cart-body']}>
          {!cart || cart.lineItems.length === 0 ? (
            <div className={styles['empty-cart']}>
              <BsCart2 />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className={styles['cart-body']}>
              <ul className={styles['cart-items']}>
                {cart.lineItems.map((item, i) => {
                  const merchandiseUrl = createUrl(
                    `/product/${item?.properties?.handle}`,
                    new URLSearchParams(item?.skuOptions)
                  );
                  const keys = Object.keys(item?.skuOptions || {});
                  const values = Object.values(item?.skuOptions || {});

                  return (
                    <li key={i} className={styles['cart-item']}>
                      <div className={styles['cart-item-info']}>
                        <Link href={merchandiseUrl} onClick={closeCart}>
                          <Image
                            width={64}
                            height={64}
                            alt={item?.properties?.title || item.productName || ''}
                            src={item?.featuredImage || '/images/no-image.png'}
                          />
                        </Link>
                        <div>
                          <Link
                            href={merchandiseUrl}
                            onClick={closeCart}
                            className={styles['product-name']}
                          >
                            {item?.properties?.title || item.productName}
                          </Link>
                          {keys &&
                            keys.map((option, index) => {
                              return (
                                <p className={styles['sku-detail']} key={index}>
                                  <span className={styles.label}>{option}</span>: {values[index]}
                                </p>
                              );
                            })}
                        </div>
                        <div className={styles['cart-item-price']}>
                          {item?.itemDiscounts && item?.itemDiscounts?.total > 0 ? (
                            <Price
                              amount={item.price.lineItemTotal}
                              originalAmount={item.price.totalPurchasePrice}
                              currencyCode={cart.currency}
                            />
                          ) : (
                            <Price
                              amount={item.price.totalPurchasePrice}
                              currencyCode={cart.currency}
                            />
                          )}
                        </div>
                      </div>
                      <div className={styles['cart-item-actions']}>
                        <DeleteItemButton item={item} />
                        <div className={styles['cart-item-quantity']}>
                          <EditItemQuantityButton item={item} type="minus" />
                          <span>{item.quantity}</span>
                          <EditItemQuantityButton item={item} type="plus" />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </OffcanvasBody>
        {cart && cart.lineItems.length > 0 && (
          <div className={styles['side-cart-footer']}>
            <div className={styles['cart-summary']}>
              <div className={styles['cart-summary-item']}>
                <span className={styles.label}>Subtotal</span>
                <span className={styles.amount}>
                  {cart?.pricingSummary?.subtotal ? (
                    <Price amount={cart.pricingSummary.subtotal} currencyCode={cart.currency} />
                  ) : (
                    'Calculated at checkout'
                  )}
                </span>
              </div>
              {cart.pricingSummary.totalDiscounts && (
                <div className={clsx(styles['cart-summary-item'], styles['discount'])}>
                  <span className={styles.label}>Discounts</span>
                  <span className={styles.amount}>
                    <Price
                      amount={cart.pricingSummary.totalDiscounts * -1}
                      currencyCode={cart.currency}
                    />
                  </span>
                </div>
              )}
              {Boolean(cart?.pricingSummary?.totalTax) && (
                <div className={styles['cart-summary-item']}>
                  <span className={styles.label}>Taxes</span>
                  <span className={styles.amount}>
                    <Price amount={cart.pricingSummary.totalTax} currencyCode={cart.currency} />
                  </span>
                </div>
              )}
              {Boolean(cart?.pricingSummary?.totalShipping) && (
                <div className={styles['cart-summary-item']}>
                  <span className={styles.label}>Shipping</span>
                  <span className={styles.amount}>Calculated at checkout</span>
                </div>
              )}
              <div className={clsx(styles['cart-summary-item'], styles['total'])}>
                <span className={styles.label}>Estimated Total</span>
                <span className={styles.amount}>
                  {cart?.pricingSummary?.grandTotal ? (
                    <Price amount={cart.pricingSummary.grandTotal} currencyCode={cart.currency} />
                  ) : (
                    'Calculated at checkout'
                  )}
                </span>
              </div>
            </div>
            <p className={styles.note}>Shipping & Taxes are calculated at checkout</p>
            <Button
              variant={'primary'}
              href="/cart"
              className={clsx(styles['cart-button'], 'rounded-pill')}
            >
              {'Cart'}
            </Button>
          </div>
        )}
      </Offcanvas>
    </div>
  );
}
