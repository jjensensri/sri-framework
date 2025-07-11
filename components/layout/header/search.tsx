'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';
import styles from './header.module.scss';
import { Button, FormControl, InputGroup } from 'react-bootstrap';

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form action="/search" className={styles['search-form']}>
      <InputGroup>
        <Button
          variant="outline-secondary"
          id="search-button"
          type="submit"
          className={styles['search-icon']}
        >
          <MagnifyingGlassIcon />
        </Button>
        <FormControl
          key={searchParams?.get('q')}
          name="q"
          placeholder="Search for products..."
          aria-label="Search for products"
          aria-describedby="basic-addon2"
          autoComplete="off"
          defaultValue={searchParams?.get('q') || ''}
        />
      </InputGroup>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <Form action="/search" className={styles['search-form']}>
      <InputGroup>
        <FormControl name="q" placeholder="Search for products..." />
        <Button
          variant="outline-secondary"
          id="search-button"
          type="submit"
          className={styles['search-icon']}
        >
          <MagnifyingGlassIcon className="h-4" />
        </Button>
      </InputGroup>
    </Form>
  );
}
