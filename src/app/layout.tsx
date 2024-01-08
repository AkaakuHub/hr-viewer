import type { Metadata } from 'next'
import { Zen_Kaku_Gothic_New } from "next/font/google";
import './globals.css'

const zengothic = Zen_Kaku_Gothic_New({
	weight: "500",
	subsets: ["latin"],
});

const siteName: string = process.env.HTML_TITLE || "";
const description: string = "";
const url = process.env.NEXT_PUBLIC_SITE_URL || "";

export const metadata: Metadata = {
	metadataBase: new URL(url),
	title: {
		default: siteName,
		template: `%s - ${siteName}`,
	},
	description,
	openGraph:{
		title: siteName,
		description,
		url,
		siteName,
		locale: "ja_JP",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: siteName,
		description,
		site: "@",
		creator: "@",
	},
	verification: undefined,
	alternates: undefined,
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const bodyClass = "bg-white text-black text-lg";
	// const rotateLittleClass = "transform rotate-0.03"
	return (
		<html lang="ja">
			<head>
			</head>
			<body className={`${zengothic.className} ${bodyClass}`}>
				<header className="text-center z-100">
					<div className="top-0 left-0 right-0 bg-blue-444 text-white text-3xl p-2"
					>{siteName} </div>
				</header>
				<div className={`mt-4 ml-4`}>
					{children}
				</div>
				<footer>
					<div className="mt-4 mb-4 text-center text-xl">
						<p>© 2024 <a target="_blank" href={process.env.TEAM_HOMEPAGE_URL} className="underline">{process.env.TEAM_NAME}</a></p>
					</div>
				</footer>
			</body>
		</html>
	)
}
