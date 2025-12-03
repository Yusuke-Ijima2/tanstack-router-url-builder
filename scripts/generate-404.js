import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const distPath = join(process.cwd(), "dist");
const indexPath = join(distPath, "index.html");
const indexContent = readFileSync(indexPath, "utf-8");

// 404.htmlをindex.htmlの完全なコピーにする
// GitHub Pagesが404エラーを返した場合でも、同じHTMLが提供され、
// クライアント側のルーター（TanStack Router）がルーティングを処理します
writeFileSync(join(distPath, "404.html"), indexContent);
console.log("✓ Generated 404.html (copy of index.html)");

