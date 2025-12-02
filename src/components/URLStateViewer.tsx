import { useLocation } from "@tanstack/react-router";
import type { SearchParams } from "../routes/index";

interface URLStateViewerProps {
  search: SearchParams;
}

export function URLStateViewer({ search }: URLStateViewerProps) {
  // useLocationフックを使用（ベストプラクティス）
  const location = useLocation();

  return (
    <div className="url-state-viewer">
      <div className="url-state-section">
        <h3>📍 現在のURL</h3>
        <div className="url-display">
          <code>{location.href}</code>
        </div>
      </div>

      <div className="url-state-section">
        <h3>🔍 URLからパースされたJSON</h3>
        <pre className="json-display">{JSON.stringify(search, null, 2)}</pre>
      </div>
    </div>
  );
}
