'use client';

import { useEffect, useState } from "react";
import renderJson2 from "../_components/renderjson2";

export default function LoginForm() {
    const [webhookData, setWebhookData] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const [noticeOfRequest, setNoticeOfRequest] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setIsFetching(true);
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const username = formData.get("username") || "";
        const password = formData.get("password") || "";

        try {
            const response = await fetch("/api/webhook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "value1": username,
                    "value2": password,
                }),
            });

            const data = await response.json();
            const status = JSON.parse(data.status);
            if (status === 1) {
                setNoticeOfRequest("API呼び出しの制限を超えました。しばらくお待ちください。");
            } else if (status === 0) {
                setNoticeOfRequest("");
                setWebhookData(data);
            } else if (status === -1) {
                setNoticeOfRequest("リクエストが不正です");
                setWebhookData(null);
            }
            setIsFetching(false);
        } catch (error) {
            console.error("Webhookリクエストエラー:", error);
        }
    };

    return (
        <div key={"login"}>
            <div className="text-center">
                <a href="/" className="text-blue-500 hover:text-blue-600">
                    Topに戻る
                </a>
            </div>
            <form onSubmit={handleSubmit} className='my-10'>
                <label>
                    ユーザー名:
                    <input style={{ border: '2px solid #414bb2' }}
                        className="text-gray-900 bg-blue-100 rounded-full px-2 py-1 mx-4" type="text" name="username" />
                </label>
                <label>
                    パスワード:
                    <input style={{ border: '2px solid #414bb2' }}
                        className="text-gray-900 bg-blue-100 rounded-full px-2 py-1 mx-4" type="password" name="password" />
                </label>

                <button
                    type="submit"
                    className={`${isFetching ? "bg-gray-500 cursor-not-allowed" :
                        "bg-blue-999 hover:bg-blue-500 active:bg-blue-600"}
                        text-white font-bold ml-8 py-2 px-4 rounded-2xl `}
                    style={{ width: "8em", height: "3em" }}
                    disabled={isFetching}
                >
                    {isFetching ? "処理中" : "送信"}
                </button>
                {noticeOfRequest !== "" ? (
                    <p className="text-red-500 text-center"
                    >{noticeOfRequest}</p>
                ) : null}
                {webhookData ?
                    (
                        renderJson2(webhookData)
                    ) :
                    null}
            </form>
        </div>
    );
}
