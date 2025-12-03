import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const distPath = join(process.cwd(), "dist");
const indexPath = join(distPath, "index.html");
const indexContent = readFileSync(indexPath, "utf-8");

// baseパスを取得（環境変数から、またはデフォルト値）
const basePath = process.env.BASE_URL || "/";

// 404.htmlにリダイレクトスクリプトを追加
const redirectScript = `
    <script>
      // GitHub Pages用の404リダイレクト
      const basePath = '${basePath}';
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      
      // baseパスを考慮してリダイレクト
      if (path.startsWith(basePath)) {
        const relativePath = path.slice(basePath.length);
        window.location.replace(basePath + 'index.html' + relativePath + search + hash);
      } else {
        window.location.replace(basePath + 'index.html' + path + search + hash);
      }
    </script>`;

// index.htmlの内容にリダイレクトスクリプトを追加
const modifiedContent = indexContent.replace("</body>", redirectScript + "\n  </body>");

writeFileSync(join(distPath, "404.html"), modifiedContent);
console.log("✓ Generated 404.html");

