import clsx from 'clsx';
import styles from './price.module.scss';

export const Price = ({
  amount,
  originalAmount,
  className,
  currencyCode = 'USD',
}: {
  amount: number;
  originalAmount?: number;
  className?: string;
  currencyCode?: string;
  currencyCodeClassName?: string;
}) => {
  return (
    <span suppressHydrationWarning={true} className={clsx(styles.price, className)}>
      <span className={clsx(styles['sale-price'], originalAmount && styles.discount)}>
        {`${new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: currencyCode || 'USD',
          currencyDisplay: 'narrowSymbol',
        }).format(amount / 100)}`}
      </span>
      {originalAmount && (
        <span className={styles.strikethrough}>
          {`${new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: currencyCode || 'USD',
            currencyDisplay: 'narrowSymbol',
          }).format(originalAmount / 100)}`}
        </span>
      )}
    </span>
  );
};

export default Price;
