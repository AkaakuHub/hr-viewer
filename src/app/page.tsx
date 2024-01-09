"use client";

import { useEffect, useReducer, useState } from "react";
import renderJson from "./_components/renderjson";

const HomePage = () => {
	const [webhookData, setWebhookData] = useState(null);
	const [isFetching, setIsFetching] = useState(true);
	const [isCountdown, setIsCountdown] = useState(false);
	const [countdown, setCountdown] = useState(60);

	const fetchData = async () => {
		try {
			const response = await fetch("/api/webhook", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					"value1": process.env.NEXT_PUBLIC_WEBHOOK_NORMAL || "hoge",
					"value2": process.env.NEXT_PUBLIC_LOCAL_STATE || "hoge",
				}),
			});

			const data = await response.json();
			const status = JSON.parse(data.status);
			if (status === 1) {
				setIsCountdown(true);
			} else if (status === 0) {
				setWebhookData(data);
			} else if (status === -1) {
				alert("リクエストが不正です");
			}
		} catch (error) {
			console.error("Webhookリクエストエラー:", error);
		}
		setIsFetching(false);
	};

	const startCountdown = () => {
		setCountdown(60);

		const intervalId = setInterval(() => {
			setCountdown((prevCount) => prevCount - 1);
		}, 1000);

		// 60秒経過後にクリーンアップ
		setTimeout(() => {
			clearInterval(intervalId);
			setCountdown(0);
		}, 60000);
	};
	useEffect(() => {
		if (countdown === 0) {
			setIsCountdown(false);
		}
	}, [countdown]);

	useEffect(() => {
		if (isCountdown) {
			startCountdown();
		}
	}, [isCountdown]);

	// ページ読み込み時に一回だけデータを取得する
	useEffect(() => {
		fetchData();
	}, []);

	const renderFirstResult = renderJson(require("./_components/data.json"));

	return (
		<div>
			<button onClick={() => {
				fetchData();
				setIsFetching(true);
			}} className=
				{`${isCountdown || isFetching ? "bg-gray-500 cursor-not-allowed" :
					"bg-blue-999 hover:bg-blue-500 active:bg-blue-600"
					} text-white py-4 px-4 mb-4 rounded-full focus:outline-none focus:shadow-outline-blue text-center flex items-center justify-center`}
				disabled={isCountdown || isFetching}
				style={{ width: "20em", height: "4em" }}
			>
				{isCountdown ? (
					<>
						API呼び出しの制限を超えました
						<br />
						あと{countdown}秒で回復します
					</>
				) :
					isFetching ? (
						<>
							最新データを取得中...
							<br />
							お待ち下さい
						</>
					)
						:
						(
							<>
								手動でデータを更新する
							</>
						)}
			</button>
			{webhookData ?
			renderJson(webhookData) : 
			renderFirstResult}
			<a href="/login"
				className="text-blue-500 hover:text-blue-600"
			>
				ログイン
			</a>
		</div>
	);
};

export default HomePage;
