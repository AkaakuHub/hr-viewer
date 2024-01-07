"use client";

import { useEffect, useReducer, useState } from 'react';

const HomePage = () => {
	const [webhookData, setWebhookData] = useState(null);

	const [isCountdown, setIsCountdown] = useState(false);
	const [countdown, setCountdown] = useState(60);

	const fetchData = async () => {
		try {
			setIsCountdown(true);
			startCountdown();
			
			const response = await fetch("/api/webhook", {
				method: "POST",
			});

			const data = await response.json();
			setWebhookData(data);
		} catch (error) {
			console.error('Webhookリクエストエラー:', error);
		}
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

	// ページ読み込み時に一回だけデータを取得する
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<button onClick={fetchData} className=
			{`${
				isCountdown ? 'bg-gray-500 cursor-not-allowed' : 
				'bg-blue-500 hover:bg-blue-700 active:bg-blue-800'
				} text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-blue`}
				disabled={isCountdown}
			>
			{isCountdown ? (
				<>
				API呼び出しの制限を超えました
				<br />
				あと{countdown}秒で回復します
				</>
			) : (
				<>
				手動で
				<br />
				更新する
				</>
			)}
			</button>
			{webhookData ? (
				<pre
				>
					
					{JSON.stringify(webhookData, null, 4)}
				</pre>
			) : (
				<pre className=""
				>
					{JSON.stringify(require('./_components/data.json'), null, 4)}
				</pre>
			)}
		</div>
	);
};

export default HomePage;
