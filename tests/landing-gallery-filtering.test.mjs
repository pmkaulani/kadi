import test from 'node:test';
import assert from 'node:assert/strict';
import { filterInvitationGallery } from '../src/lib/templates/gallery-search';

const cards = [
  {
    id: 'wedding',
    category: 'wedding',
    categoryLabel: 'Wedding',
    title: 'Wanjiku & Otieno',
    subtitle: 'A celebration with family',
    dateText: '12 December 2026',
    venueText: 'Nairobi Chapel, Nairobi',
    celebrants: 'Wanjiku & Otieno',
  },
  {
    id: 'heritage-wedding',
    category: 'heritage',
    categoryLabel: 'Heritage & African',
    title: 'Harusi Yetu',
    subtitle: 'A Swahili wedding celebration',
    dateText: '18 December 2026',
    venueText: 'Fort Jesus, Mombasa',
    celebrants: 'Tariq & Amina',
  },
  {
    id: 'milestone',
    category: 'milestone',
    categoryLabel: 'Milestones & Honours',
    title: 'Golden Jubilee',
    subtitle: 'A milestone celebration',
    dateText: '5 December 2027',
    venueText: 'Nairobi Serena',
    celebrants: 'David Gitau',
  },
  {
    id: 'corporate',
    category: 'corporate',
    categoryLabel: 'Gala',
    title: 'Horizon Gala',
    subtitle: 'An evening for creative arts',
    dateText: '28 November 2028',
    venueText: 'KICC, Nairobi',
    celebrants: 'Horizon Foundation',
  },
  {
    id: 'anniversary',
    category: 'anniversary',
    categoryLabel: 'Anniversary',
    title: 'Silver Anniversary',
    subtitle: 'Twenty-five years together',
    dateText: '19 July 2028',
    venueText: 'Naivasha',
    celebrants: 'Marco & Sophia',
  },
  {
    id: 'birthday',
    category: 'birthday',
    categoryLabel: 'Birthday',
    title: 'Studio 74',
    subtitle: 'A disco birthday',
    dateText: '27 October 2028',
    venueText: 'Westlands, Nairobi',
    celebrants: 'Chloe',
  },
];

test('gallery search is trimmed and case-insensitive', () => {
  assert.deepEqual(
    filterInvitationGallery(cards, 'all', '  wAnJiKu  ').map((card) => card.id),
    ['wedding']
  );
});

test('gallery search includes venue and date details', () => {
  assert.deepEqual(
    filterInvitationGallery(cards, 'all', 'fort jesus').map((card) => card.id),
    ['heritage-wedding']
  );
  assert.deepEqual(
    filterInvitationGallery(cards, 'all', '28 november 2028').map((card) => card.id),
    ['corporate']
  );
});

test('wedding filter includes cultural weddings but not anniversaries', () => {
  assert.deepEqual(
    filterInvitationGallery(cards, 'wedding', '').map((card) => card.id),
    ['wedding', 'heritage-wedding']
  );
});

test('graduation and honours filter does not pull in unrelated corporate galas', () => {
  assert.deepEqual(
    filterInvitationGallery(cards, 'graduation', '').map((card) => card.id),
    ['milestone']
  );
});

test('unmatched searches return no cards instead of leaking the full gallery back in', () => {
  assert.deepEqual(filterInvitationGallery(cards, 'all', 'this design does not exist'), []);
});

test('unfiltered gallery preserves the full source order', () => {
  assert.deepEqual(
    filterInvitationGallery(cards, 'all', '').map((card) => card.id),
    cards.map((card) => card.id)
  );
});
