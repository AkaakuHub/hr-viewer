"use client";

import { useEffect, useReducer, useState } from 'react';
import renderJson from './_components/renderjson';

const HomePage = () => {
	const [webhookData, setWebhookData] = useState(null);
	const [isFetching, setIsFetching] = useState(true);
	const [isCountdown, setIsCountdown] = useState(false);
	const [countdown, setCountdown] = useState(60);

	const fetchData = async () => {
		try {
			const response = await fetch("/api/webhook", {
				method: "POST",
			});

			const data = await response.json();
			const status = JSON.parse(data.status);
			if (status === 1) {
				setIsCountdown(true);
			} else if (status === 0) {
				setWebhookData(data);
			}
		} catch (error) {
			console.error('Webhookリクエストエラー:', error);
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

	return (
		<div>
			<button onClick={()=> {
				fetchData();
			}} className=
			{`${
				isCountdown || isFetching ? 'bg-gray-500 cursor-not-allowed' : 
				'bg-blue-500 hover:bg-blue-700 active:bg-blue-800'
				} text-white py-2 px-4 mb-4 rounded-full focus:outline-none focus:shadow-outline-blue`}
				disabled={isCountdown || isFetching}
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
				　  　最新データを取得中　  　
				<br />
				　　　お待ち下さい　　　
				</>
			)
			:
			(
				<>
				　　　　 　手動で　　　　 　
				<br />
				　　　　　更新する　　　　　
				</>
			)}
			</button>
			{webhookData ? renderJson(webhookData) : renderJson(require('./_components/data.json')) }
		</div>
	);
};

export default HomePage;
