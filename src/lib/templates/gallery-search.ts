export interface InvitationGallerySearchRecord {
  category: string;
  categoryLabel: string;
  title: string;
  subtitle: string;
  dateText: string;
  venueText: string;
  celebrants?: string;
}

/**
 * Filter the landing-page gallery without inventing fallback results.
 * Cultural wedding examples are discoverable in both Heritage and Weddings;
 * milestone celebrations are included with Graduations/Honours.
 */
export function filterInvitationGallery<T extends InvitationGallerySearchRecord>(
  cards: readonly T[],
  selectedCategory: string,
  query: string
): T[] {
  const normalizedQuery = query.trim().toLowerCase();

  return cards.filter((card) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      card.category === selectedCategory ||
      (selectedCategory === 'wedding' && card.category === 'heritage') ||
      (selectedCategory === 'graduation' && card.category === 'milestone');

    const searchableText = [
      card.title,
      card.subtitle,
      card.categoryLabel,
      card.dateText,
      card.venueText,
      card.celebrants ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });
}
