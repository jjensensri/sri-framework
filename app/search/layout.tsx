import Collections from '@components/layout/search/collections';
import FilterList from '@components/layout/search/filter';
import { sorting } from '@lib/constants';
import ChildrenWrapper from './children-wrapper';
import React, { Suspense } from 'react';
import Loading from '@app/search/loading';
import { Col, Container, Row } from 'react-bootstrap';
import styles from './search.module.scss';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className={styles.search}>
      <Container>
        <Row>
          <Col xs={12} md={4} lg={3}>
            <Collections />
            <FilterList list={sorting} title="Sort by" />
          </Col>
          <Col xs={12} md={8} lg={9}>
            <Suspense fallback={<Loading />}>
              <ChildrenWrapper>{children}</ChildrenWrapper>
            </Suspense>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
