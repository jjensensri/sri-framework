'use client';

import { BsPlus } from 'react-icons/bs';
import clsx from 'clsx';
import { addItem } from '@components/cart/actions';
import { useProduct } from '@components/product/product-context';
import { Product, Variant } from '@lib/catalog-api/types';
import { useActionState } from 'react';

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <BsPlus />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
      })}
    >
      Add To Cart
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: Variant) =>
    variant.selectedOptions.every(
      (option: any) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find((variant: any) => variant.id === selectedVariantId)!;
  const payload = {
    skuId: finalVariant?.id,
    quantity: 1, // todo: josh add qty selector
  };
  const addItemAction = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        addItemAction();
      }}
    >
      <SubmitButton availableForSale={availableForSale} selectedVariantId={selectedVariantId} />
      <p aria-live="polite" className="visually-hidden" role="status">
        {message}
      </p>
    </form>
  );
}
