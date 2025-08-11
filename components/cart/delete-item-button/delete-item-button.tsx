'use client';

import { BsTrash } from 'react-icons/bs';
import { removeItem } from '@components/cart/actions';
import type { LineItem } from '@lib/cart-api/types';
import { useActionState } from 'react';
import styles from './delete-item-button.module.scss';

export function DeleteItemButton({ item }: { item: LineItem }) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.id;
  const removeItemAction = formAction.bind(null, merchandiseId);

  return (
    <form
      action={async () => {
        removeItemAction();
      }}
    >
      <button type="submit" aria-label="Remove cart item" className={styles['delete-item-button']}>
        <BsTrash />
        Remove
      </button>
      <p aria-live="polite" className="visually-hidden" role="status">
        {message}
      </p>
    </form>
  );
}
