import type { SearchParams } from "../routes/index";

interface ProductFiltersProps {
  search: SearchParams;
  onUpdate: (updates: Partial<SearchParams>) => void;
}

const CATEGORIES = [
  { value: "", label: "すべて" },
  { value: "electronics", label: "電子機器" },
  { value: "furniture", label: "家具" },
];

const SORT_OPTIONS = [
  { value: "", label: "並び順を選択" },
  { value: "name", label: "名前順" },
  { value: "price-asc", label: "価格: 安い順" },
  { value: "price-desc", label: "価格: 高い順" },
  { value: "rating", label: "評価順" },
] as const;

// 有効なソート値の配列（空文字列を除く）
const VALID_SORT_VALUES: readonly string[] = SORT_OPTIONS.filter(
  (opt) => opt.value !== ""
).map((opt) => opt.value);

// 型ガード関数: 値が有効なソート値かどうかをチェック
function isValidSortValue(
  value: string
): value is NonNullable<SearchParams["sort"]> {
  return VALID_SORT_VALUES.includes(value);
}

const TAGS = [
  "tech",
  "computer",
  "accessory",
  "office",
  "comfort",
  "health",
  "display",
  "input",
  "lighting",
  "audio",
  "organization",
  "cable",
  "protection",
];

export function ProductFilters({ search, onUpdate }: ProductFiltersProps) {
  const selectedTags = search.tags || [];

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onUpdate({ tags: [...selectedTags, tag] });
    }
  };

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    onUpdate({ tags: newTags.length > 0 ? newTags : undefined });
  };

  const clearAll = () => {
    onUpdate({
      q: undefined,
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sort: undefined,
      tags: undefined,
      inStock: undefined,
    });
  };

  return (
    <div className="filters">
      <div className="filters-header">
        <h3>🔧 フィルタ</h3>
        <button className="clear-button" onClick={clearAll}>
          すべてクリア
        </button>
      </div>

      <div className="filter-group">
        <label htmlFor="search">検索キーワード</label>
        <input
          id="search"
          type="text"
          placeholder="商品名で検索..."
          value={search.q || ""}
          onChange={(e) => onUpdate({ q: e.target.value || undefined })}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category">カテゴリ</label>
        <select
          id="category"
          value={search.category || ""}
          onChange={(e) => onUpdate({ category: e.target.value || undefined })}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>価格範囲</label>
        <div className="price-range">
          <input
            type="number"
            placeholder="最低価格"
            value={search.minPrice || ""}
            onChange={(e) =>
              onUpdate({ minPrice: e.target.value || undefined })
            }
          />
          <span>〜</span>
          <input
            type="number"
            placeholder="最高価格"
            value={search.maxPrice || ""}
            onChange={(e) =>
              onUpdate({ maxPrice: e.target.value || undefined })
            }
          />
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="sort">並び順</label>
        <select
          id="sort"
          value={search.sort || ""}
          onChange={(e) => {
            const value = e.target.value;
            // 空文字列の場合はundefined、それ以外は有効な値かチェック
            if (value === "") {
              onUpdate({ sort: undefined });
            } else if (isValidSortValue(value)) {
              onUpdate({ sort: value });
            }
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>
          <input
            type="checkbox"
            checked={search.inStock === "true"}
            onChange={(e) =>
              onUpdate({ inStock: e.target.checked ? "true" : undefined })
            }
          />
          在庫ありのみ
        </label>
      </div>

      <div className="filter-group">
        <label>タグ</label>
        <div className="tags-input">
          <div className="selected-tags">
            {selectedTags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
                <button onClick={() => removeTag(tag)}>×</button>
              </span>
            ))}
          </div>
          <div className="available-tags">
            {TAGS.filter((tag) => !selectedTags.includes(tag)).map((tag) => (
              <button
                key={tag}
                className="tag-button"
                onClick={() => addTag(tag)}
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
