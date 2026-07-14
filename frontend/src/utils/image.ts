// LoremFlickr returns a real (Creative Commons licensed) photo tagged with
// the keyword you give it, so placeholder images actually match what
// they're standing in for — unlike purely random placeholder services.
// https://loremflickr.com/{width}/{height}/{keyword}

// LoremFlickr returns a real (Creative Commons licensed) photo tagged with
// the keyword you give it. Using a single, common keyword (rather than
// several joined together, which LoremFlickr treats as a strict AND) gives
// far more relevant matches — this is only a fallback for items that don't
// have a curated imageUrl of their own (e.g. a partner adds a product
// without picking a photo).

function toKeyword(text: string): string {
  const stopwords = new Set(["fresh", "grilled", "homemade", "classic", "special", "the", "a", "and", "with"]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w && !stopwords.has(w));
  const keyword = words[0] || text.toLowerCase();
  return encodeURIComponent(keyword);
}

export function productPlaceholder(title: string, width = 400, height = 300): string {
  return `https://loremflickr.com/${width}/${height}/${toKeyword(title)}`;
}

export function storePlaceholder(category: string | undefined, width = 600, height = 400): string {
  const keyword = category ? category.toLowerCase() : "storefront";
  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(keyword)}`;
}
