import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useTransition } from "react";

/**
 * URLパラメータを即座に反応するローカル状態で管理するカスタムフック
 * 日本語入力（IME）の遅延を防ぐために使用
 */
export function useResponsiveQueryParam<T>(
  paramName: string,
  defaultValue: T,
  routeFullPath: "/"
): [T, (value: T) => void, boolean] {
  const navigate = useNavigate({ from: routeFullPath });
  const search = useSearch({ strict: false });

  // URLの値
  const urlValue =
    (search as Record<string, unknown>)[paramName] ?? defaultValue;

  // ローカル状態（即座の反応用）
  const [localValue, setLocalValue] = useState<T>(urlValue as T);

  const [isPending, startTransition] = useTransition();

  // URL変更をローカル状態に反映
  useEffect(() => {
    if (!isPending) {
      setLocalValue(urlValue as T);
    }
  }, [urlValue, isPending]);

  // 更新関数
  const updateValue = useCallback(
    (newValue: T) => {
      // 1. 即座にローカル状態を更新（UIが即反応）
      setLocalValue(newValue);

      // 2. URLを非同期で更新
      startTransition(() => {
        // デフォルト値と等しい場合、または文字列型で空文字列の場合はundefinedに変換
        const shouldRemove =
          newValue === defaultValue ||
          (typeof newValue === "string" && newValue === "");

        navigate({
          search: (prev) => ({
            ...prev,
            [paramName]: shouldRemove ? undefined : newValue,
          }),
          replace: true,
        });
      });
    },
    [navigate, paramName, defaultValue]
  );

  return [localValue, updateValue, isPending];
}
