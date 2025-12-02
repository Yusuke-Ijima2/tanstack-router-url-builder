interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  tags: string[];
  inStock: boolean;
}

interface ProductListProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductList({
  products,
  currentPage,
  totalPages,
  onPageChange,
}: ProductListProps) {
  const getCategoryLabel = (category: string) => {
    return category === "electronics" ? "電子機器" : "家具";
  };

  if (products.length === 0) {
    return (
      <div className="no-products">
        <p>該当する商品が見つかりませんでした。</p>
        <p>検索条件を変更してお試しください。</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-header">
              <h3>{product.name}</h3>
              <span
                className={`stock-badge ${product.inStock ? "in-stock" : "out-of-stock"}`}
              >
                {product.inStock ? "在庫あり" : "在庫なし"}
              </span>
            </div>
            <div className="product-info">
              <div className="product-category">
                📁 {getCategoryLabel(product.category)}
              </div>
              <div className="product-price">
                ¥{product.price.toLocaleString()}
              </div>
              <div className="product-rating">⭐ {product.rating}</div>
            </div>
            <div className="product-tags">
              {product.tags.map((tag) => (
                <span key={tag} className="product-tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            ← 前へ
          </button>
          <span className="page-info">
            ページ {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            次へ →
          </button>
        </div>
      )}
    </div>
  );
}
