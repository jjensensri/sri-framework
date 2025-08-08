// todo: cms
// todo: josh

import page from '@app/data/page.json';
import { Page } from '@lib/cms-api/types';

export async function getPage(handle: string): Promise<Page | undefined> {
  return page;
}
