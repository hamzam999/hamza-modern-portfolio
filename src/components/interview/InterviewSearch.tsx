interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

export default function InterviewSearch({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories }: Props) {
  return (
    <div className="iv-search">
      <label className="iv-search__label" htmlFor="iv-q">
        Search questions
      </label>
      <input
        id="iv-q"
        type="search"
        name="q"
        autoComplete="off"
        className="iv-search__input"
        placeholder="Keyword or technology tag"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div role="group" aria-label="Category" className="iv-cats">
        {categories.map((cat) => (
          <button key={cat} type="button" aria-pressed={selectedCategory === cat} className="iv-cat" onClick={() => setSelectedCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
