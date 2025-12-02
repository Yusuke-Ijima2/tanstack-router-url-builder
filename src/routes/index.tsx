import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo } from "react";
import { URLStateViewer } from "../components/URLStateViewer";
import { ProductFilters } from "../components/ProductFilters";
import { ProductList } from "../components/ProductList";
import "../App.css";

// Zodスキーマによる検索パラメータの型定義とバリデーション
const searchParamsSchema = z.object({
  q: z.string().catch("").optional(), // 検索キーワード
  category: z.string().catch("").optional(), // カテゴリ
  minPrice: z.string().catch("").optional(), // 最低価格
  maxPrice: z.string().catch("").optional(), // 最高価格
  sort: z
    .enum(["name", "price-asc", "price-desc", "rating"])
    .catch(undefined as any)
    .optional(), // ソート順
  page: z.string().catch("1").optional(), // ページ番号
  tags: z.array(z.string()).catch([]).optional(), // タグ（配列）
  inStock: z
    .enum(["true", "false"])
    .catch(undefined as any)
    .optional(), // 在庫ありのみ
});

// 型推論でSearchParams型を生成
export type SearchParams = z.infer<typeof searchParamsSchema>;

export const Route = createFileRoute("/")({
  // zodValidatorを使う理由:
  // 1. オプショナルパラメータを正しく推論: navigate({ search: {} }) が可能
  // 2. input型とoutput型を区別: ナビゲーション時と読み取り時で型が異なる場合に対応
  // 3. .catch()を使っても型が保持される（fallbackと組み合わせる場合）
  //
  // スキーマを直接渡す場合 (validateSearch: searchParamsSchema):
  // - .default()を使うと、ナビゲーション時にsearchが必須になる
  // - .catch()を使うと型がunknownになる可能性がある
  validateSearch: zodValidator(searchParamsSchema),
  component: App,
});

// ダミーの商品データ
const PRODUCTS = [
  {
    id: 1,
    name: "ノートパソコン",
    category: "electronics",
    price: 89900,
    rating: 4.5,
    tags: ["tech", "computer"],
    inStock: true,
  },
  {
    id: 2,
    name: "ワイヤレスマウス",
    category: "electronics",
    price: 2980,
    rating: 4.2,
    tags: ["tech", "accessory"],
    inStock: true,
  },
  {
    id: 3,
    name: "デスクチェア",
    category: "furniture",
    price: 15900,
    rating: 4.7,
    tags: ["office", "comfort"],
    inStock: true,
  },
  {
    id: 4,
    name: "スタンディングデスク",
    category: "furniture",
    price: 45900,
    rating: 4.8,
    tags: ["office", "health"],
    inStock: false,
  },
  {
    id: 5,
    name: "モニター27インチ",
    category: "electronics",
    price: 32900,
    rating: 4.6,
    tags: ["tech", "display"],
    inStock: true,
  },
  {
    id: 6,
    name: "キーボード",
    category: "electronics",
    price: 8900,
    rating: 4.4,
    tags: ["tech", "input"],
    inStock: true,
  },
  {
    id: 7,
    name: "デスクランプ",
    category: "furniture",
    price: 3900,
    rating: 4.1,
    tags: ["office", "lighting"],
    inStock: true,
  },
  {
    id: 8,
    name: "ヘッドフォン",
    category: "electronics",
    price: 12900,
    rating: 4.3,
    tags: ["tech", "audio"],
    inStock: true,
  },
  {
    id: 9,
    name: "ブックスタンド",
    category: "furniture",
    price: 2400,
    rating: 4.0,
    tags: ["office", "organization"],
    inStock: true,
  },
  {
    id: 10,
    name: "USB-Cケーブル",
    category: "electronics",
    price: 1200,
    rating: 3.9,
    tags: ["tech", "cable"],
    inStock: false,
  },
  {
    id: 11,
    name: "マウスパッド",
    category: "electronics",
    price: 1500,
    rating: 4.2,
    tags: ["tech", "accessory"],
    inStock: true,
  },
  {
    id: 12,
    name: "デスクマット",
    category: "furniture",
    price: 3200,
    rating: 4.1,
    tags: ["office", "protection"],
    inStock: true,
  },
];

function App() {
  // Route.useNavigate()を使用（ベストプラクティス）
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  // フィルタリングとソート
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // 検索キーワード
    if (search.q) {
      const query = search.q.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    // カテゴリ
    if (search.category) {
      result = result.filter((p) => p.category === search.category);
    }

    // 価格範囲
    if (search.minPrice) {
      const min = parseInt(search.minPrice);
      result = result.filter((p) => p.price >= min);
    }
    if (search.maxPrice) {
      const max = parseInt(search.maxPrice);
      result = result.filter((p) => p.price <= max);
    }

    // タグ
    if (search.tags && search.tags.length > 0) {
      result = result.filter((p) =>
        search.tags!.some((tag: string) => p.tags.includes(tag))
      );
    }

    // 在庫
    if (search.inStock === "true") {
      result = result.filter((p) => p.inStock);
    }

    // ソート
    if (search.sort) {
      switch (search.sort) {
        case "name":
          result.sort((a, b) => a.name.localeCompare(b.name, "ja"));
          break;
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    return result;
  }, [search]);

  // ページネーション
  const page = parseInt(search.page || "1");
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, page]);

  const updateSearch = (updates: Partial<SearchParams>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...updates,
        page: "1", // 検索条件変更時は1ページ目に戻す
      }),
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🛍️ TanStack Router デモアプリ</h1>
        <p className="subtitle">
          URLベースの状態管理で商品を検索・フィルタリング
        </p>
      </header>

      <div className="main-content">
        <div className="filters-panel">
          <ProductFilters search={search} onUpdate={updateSearch} />
        </div>

        <div className="products-panel">
          <div className="results-header">
            <h2>
              {filteredProducts.length}件の商品が見つかりました
              {totalPages > 1 && ` (ページ ${page}/${totalPages})`}
            </h2>
          </div>
          <ProductList
            products={paginatedProducts}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) =>
              navigate({
                search: (prev) => ({
                  ...prev,
                  page: newPage.toString(),
                }),
              })
            }
          />
        </div>
      </div>

      <URLStateViewer search={search} />
    </div>
  );
}
