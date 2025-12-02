import { useLocation } from "@tanstack/react-router";
import { useMemo } from "react";
import type { SearchParams } from "../routes/index";

interface URLStateViewerProps {
  search: SearchParams;
}

export function URLStateViewer({ search }: URLStateViewerProps) {
  // useLocationフックを使用（ベストプラクティス）
  const location = useLocation();

  // URLパース結果のJSON
  const parsedUrl = useMemo(() => {
    try {
      // searchParamsを手動でパース（location.searchStrを使用）
      const searchParams: Record<string, string> = {};
      if (location.searchStr) {
        const params = new URLSearchParams(location.searchStr);
        params.forEach((value, key) => {
          searchParams[key] = value;
        });
      }

      return {
        href: location.href,
        pathname: location.pathname,
        search: search,
        searchParams: searchParams,
        hash: location.hash || null,
      };
    } catch (error) {
      return {
        href: location.href,
        pathname: location.pathname,
        search: search,
        searchParams: {},
        hash: location.hash || null,
        error: "URL parsing failed",
      };
    }
  }, [location, search]);

  return (
    <div className="url-state-viewer">
      <div className="url-state-section">
        <h3>📍 現在のURL</h3>
        <div className="url-display">
          <code>{location.href}</code>
        </div>
      </div>

      <div className="url-state-section">
        <h3>🔍 パースされたJSON</h3>
        <pre className="json-display">{JSON.stringify(parsedUrl, null, 2)}</pre>
      </div>

      <div className="url-state-section">
        <h3>📊 検索パラメータ（型安全）</h3>
        <pre className="json-display">{JSON.stringify(search, null, 2)}</pre>
      </div>
    </div>
  );
}
