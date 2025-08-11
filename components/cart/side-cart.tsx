'use client';

import { BsBag, BsCart } from 'react-icons/bs';
import Price from '@components/price';
import { createUrl } from '@lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createCartAndSetCookie, redirectToCheckout } from './actions';
import { useCart } from './cart-context';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle } from 'react-bootstrap';
import styles from './cart.module.scss';

export default function SideCart() {
  const { cart, cartQuantity } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const quantityRef = useRef(cartQuantity);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {}, []);

  // useEffect(() => {
  //   if (
  //     cart?.totalQuantity &&
  //     cart?.totalQuantity !== quantityRef.current &&
  //     cart?.totalQuantity > 0
  //   ) {
  //     if (!isOpen) {
  //       setIsOpen(true);
  //     }
  //     quantityRef.current = cart?.totalQuantity;
  //   }
  // }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <div className={styles['side-cart']}>
      <Button className={styles['side-cart-toggle']} variant={'outline-light'} onClick={openCart}>
        <BsCart />
        {cartQuantity ? <div className={styles['cart-quantity']}>{cartQuantity}</div> : null}
      </Button>

      <Offcanvas show={isCartOpen} onHide={closeCart} placement={'end'}>
        <OffcanvasHeader closeButton>
          <OffcanvasTitle>Bag</OffcanvasTitle>
        </OffcanvasHeader>
        <OffcanvasBody>
          {!cart || cart.lineItems.length === 0 ? (
            <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
              <BsBag />
              <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between overflow-visible">
              <ul className="grow py-4">
                {cart.lineItems.map((item, i) => {
                  const merchandiseUrl = createUrl(
                    `/product/${item.handle}`,
                    new URLSearchParams(item?.skuOptions)
                  );

                  return (
                    <li
                      key={i}
                      className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                    >
                      <div className="relative flex w-full flex-row justify-between px-0 py-4">
                        <div className="absolute z-40 -ml-2 -mt-2">
                          <DeleteItemButton item={item} type={`x`} />
                        </div>
                        <div className="flex flex-row">
                          <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                            <Image
                              className="h-full w-full object-cover"
                              width={64}
                              height={64}
                              alt={item.productName || ''}
                              src={item.featuredImage || ''}
                            />
                          </div>
                          <Link
                            href={merchandiseUrl}
                            onClick={closeCart}
                            className="z-30 ml-2 flex flex-row space-x-4"
                          >
                            <div className="flex flex-1 flex-col text-base">
                              <span className="leading-tight">{item.productName}</span>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {item.productName}
                              </p>
                            </div>
                          </Link>
                        </div>
                        <div className="flex h-16 flex-col justify-between">
                          <Price
                            className="flex justify-end space-y-2 text-right text-sm"
                            amount={item.price.purchasePrice}
                            currencyCode={cart.currency}
                          />
                          <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                            <EditItemQuantityButton item={item} type="minus" />
                            <p className="w-6 text-center">
                              <span className="w-full text-sm">{item.quantity}</span>
                            </p>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                  <p>Taxes</p>
                  <Price
                    className="text-right text-base text-black dark:text-white"
                    amount={cart.pricingSummary.totalTax}
                    currencyCode={cart.currency}
                  />
                </div>
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                  <p>Shipping</p>
                  <p className="text-right">Calculated at checkout</p>
                </div>
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                  <p>Total</p>
                  <Price
                    className="text-right text-base text-black dark:text-white"
                    amount={cart.pricingSummary.grandTotal}
                    currencyCode={cart.currency}
                  />
                </div>
              </div>
              <form action={redirectToCheckout}>
                <CheckoutButton />
              </form>
            </div>
          )}
        </OffcanvasBody>
      </Offcanvas>
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <a
      href="/cart"
      className="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
    >
      {'Cart'}
    </a>
  );
}
