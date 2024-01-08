import { NextRequest } from "next/server";
import fs from "fs/promises";

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
				"guest": process.env.LOCAL_STATE
			}),
		});
		const json = await response.json();
		const status = json.status;
		if (status === "0"){
			await saveJson(json);
		}
		return new Response(JSON.stringify(json), {
			headers: { "Content-Type": "application/json" },
			status: 200,
		});
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
