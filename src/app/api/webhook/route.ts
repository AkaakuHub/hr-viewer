import { NextRequest } from "next/server";
import fs from "fs/promises";
import { read } from "fs";

export async function POST(req: NextRequest) {
	try {
		const url = process.env.WEBHOOK_URL;
		if (typeof url !== "string") {
			return new Response("error message", { status: 400 });
		}

		if (req.method !== "POST") {
			return new Response("Method Not Allowed", { status: 405 });
		}

		const clientIP = req.headers.get("x-forwarded-for") || "unknown";

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"ip_address": clientIP,
				"guest": "from_route"
			}),
		});
		const json = await response.json();
		// statusが0ならば、
		// jsonをファイルとしてサーバーサイドに保存
		const status = json.status;
		console.log(status);
		if (status === "0"){
			await saveJson(json);
			return new Response(JSON.stringify(json), {
				headers: { "Content-Type": "application/json" },
				status: 200,
			});
		} else {
			// statusが0以外ならば、"./src/app/_components/data.json"のjsonを返す
			const path = "./src/app/_components/data.json";
			try{
				const fileData = await fs.readFile(path, "utf-8");
				return new Response(fileData, {
					headers: { "Content-Type": "application/json" },
					status: 200,
				});
			} catch (error) {
				console.error("ファイル読み込みエラー:", error);
				return new Response("Internal server error", { status: 500 });
			}
		}
	} catch (error) {
		console.error("Webhookサーバーエラー:", error);
		return new Response("Internal server error", { status: 500 });
	}
}

async function saveJson(json: any) {
	try {
		const data = JSON.stringify(json);
		const path = "./src/app/_components/data.json";
		await fs.writeFile(path, data);
	} catch (error) {
		console.error("ファイル保存エラー:", error);
	}
}

// jsonのstatusは0が保証されている