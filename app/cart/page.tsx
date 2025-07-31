import { notFound } from 'next/navigation';

import { DEFAULT_OPTION } from '@lib/constants';
import { getCart } from '@lib/cart-api';
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { createUrl } from '@lib/utils';
import { DeleteItemButton } from '@components/cart/delete-item-button';
import Price from '@components/price';
import { EditItemQuantityButton } from '@components/cart/edit-item-quantity-button';
import Image from 'next/image';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default async function CartPage(props: { params: Promise<{ handle: string }> }) {
  const cart = await getCart();

  if (!cart) return notFound();

  return (
    <section className="my-9">
      <div className="mx-auto grid max-w-(--breakpoint-lg) px-4 pb-4 lg:max-h-[calc(100vh-200px)] mb-4">
        <div className="flex items-center justify-between pb-5">
          <p className="text-lg font-semibold">My Cart</p>
        </div>

        {!cart || cart?.lines?.length === 0 ? (
          <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
            <ShoppingCartIcon className="h-16" />
            <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col justify-between overflow-hidden p-1 items-end ">
            <ul className="w-full grow overflow-auto p-5 bg-white rounded-xl border-1">
              {cart?.lines
                ?.sort((a, b) =>
                  a.merchandise.product.title.localeCompare(b.merchandise.product.title)
                )
                .map((item, i) => {
                  const merchandiseSearchParams = {} as MerchandiseSearchParams;

                  item.merchandise.selectedOptions.forEach(({ name, value }) => {
                    if (value !== DEFAULT_OPTION) {
                      merchandiseSearchParams[name.toLowerCase()] = value;
                    }
                  });

                  const merchandiseUrl = createUrl(
                    `/product/${item.merchandise.product.handle}`,
                    new URLSearchParams(merchandiseSearchParams)
                  );

                  console.log('item.merchandise: ', item.merchandise);

                  return (
                    <li
                      key={i}
                      className={`flex w-full flex-col  border-neutral-300 dark:border-neutral-700 ${i !== 0 && 'border-t'}`}
                    >
                      <div
                        className={`relative flex w-full flex-row justify-between px-1 py-5 ${i === cart?.lines?.length - 1 && 'pb-0'} ${i === 0 && 'pt-0'}`}
                      >
                        <div className="flex flex-row">
                          <div className="relative h-28 w-28 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                            <Image
                              className="h-full w-full object-cover"
                              width={112}
                              height={112}
                              alt={
                                item.merchandise.product.featuredImage.altText ||
                                item.merchandise.product.title
                              }
                              src={item.merchandise.product.featuredImage.url}
                            />
                          </div>
                          <Link href={merchandiseUrl} className="z-30 ml-5 flex flex-row space-x-4">
                            <div className="flex flex-1 flex-col text-base leading-relaxed">
                              <span className="font-bold">{item.merchandise.product.title}</span>
                              {item.merchandise.title !== DEFAULT_OPTION
                                ? item.merchandise.selectedOptions.map((option, i) => (
                                    <p
                                      className="text-xs leading-normal text-neutral-500 dark:text-neutral-400"
                                      key={i}
                                    >
                                      {option.name}: {option.value}
                                    </p>
                                  ))
                                : null}
                            </div>
                          </Link>
                        </div>
                        <div className="flex  flex-col justify-between">
                          <Price
                            className="flex justify-end space-y-2 text-right text-md mb-2 font-bold"
                            amount={item.cost.totalAmount.amount}
                            currencyCode={cart.currency}
                          />
                          <div className="ml-auto my-2 flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                            <EditItemQuantityButton item={item} type="minus" />
                            <p className="w-6 text-center">
                              <span className="w-full text-sm">{item.quantity}</span>
                            </p>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>
                          <div className="mt-2 flex justify-end">
                            <DeleteItemButton item={item} type={`trash`} />
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
            <div className="mt-9 p-5 text-sm text-neutral-500 dark:text-neutral-400 bg-white rounded-xl border-1 max-w-[400px] w-full">
              <div className="mb-3 flex items-center justify-between  border-neutral-200 pb-1 dark:border-neutral-700">
                <p>Taxes</p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={cart.pricingSummary.totalTax.toString()}
                  currencyCode={cart.currency}
                />
              </div>
              <div className="mb-3 flex items-center justify-between  border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                <p>Shipping</p>
                <p className="text-right">Calculated at checkout</p>
              </div>
              <div className=" flex items-center justify-between  border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                <p>Total</p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={cart.pricingSummary.subtotal}
                  currencyCode={cart.currency}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
