import { useEffect, useState } from "react";

// メディアクエリをチェックする関数
const checkMediaQuery = (query: string) => {
	if (typeof window === "undefined") {
		return false; // サーバーサイドで実行されている場合、メディアクエリは評価できません
	}

	const mediaQuery = window.matchMedia(query);
	return mediaQuery.matches;
};

const useMediaquery = () => {
	const [mediaSize, setMediaSize] = useState<string | null>(null);

	useEffect(() => {
		const handleResize = () => {
			// 画面サイズに応じてメディアサイズを設定
			if (checkMediaQuery("(min-width: 1024px)")) {
				setMediaSize("desktop");
			} else if (checkMediaQuery("(min-width: 768px)")) {
				setMediaSize("tablet");
			} else {
				setMediaSize("mobile");
			}
		};

		// レンダリング時とウィンドウのサイズ変更時にイベントリスナーを追加
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []); // この useEffect はコンポーネントのマウント時にのみ実行されます

	return mediaSize;
};

export default useMediaquery;
