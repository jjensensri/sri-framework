'use client';

import { BsTrash3, BsX } from 'react-icons/bs';
import { removeItem } from '@components/cart/actions';
import type { LineItem } from '@lib/cart-api/types';
import { useActionState } from 'react';
import { useCart } from './cart-context';
import clsx from 'clsx';

export function DeleteItemButton({ item, type }: { item: LineItem; type: 'x' | 'trash' }) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.id;
  const removeItemAction = formAction.bind(null, merchandiseId);

  return (
    <form
      action={async () => {
        removeItemAction();
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className={clsx(
          'flex items-center justify-center rounded-full cursor-pointer',
          {
            'h-[24px] w-[24px] bg-white border': type === 'x',
          },
          {
            'text-sm gap-1 hover:underline': type !== 'x',
          }
        )}
      >
        {type === 'x' ? (
          <BsX className="mx-[1px] h-4 w-4 text-black" />
        ) : (
          <>
            Remove <BsTrash3 className="mx-[1px] h-[16px] w-[16px] text-black" />
          </>
        )}
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
