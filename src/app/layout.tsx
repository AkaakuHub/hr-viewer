import type { Metadata } from 'next'
import { Zen_Kaku_Gothic_New } from "next/font/google";
import './globals.css'

const zengothic = Zen_Kaku_Gothic_New({
	weight: "500",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: process.env.HTML_TITLE,
	description: "",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const bodyClass = "bg-white text-black text-lg";
	const rotateLittleClass = "";
	// const rotateLittleClass = "transform rotate-0.03"
	return (
		<html lang="ja">
			<head>
				<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
				<link rel="manifest" href="/favicons/site.webmanifest" />
				<link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#414bb2" />
				<link rel="shortcut icon" href="/favicons/favicon.ico" />
				<meta name="msapplication-TileColor" content="#414bb2" />
				<meta name="msapplication-config" content="/favicons/browserconfig.xml" />
				<meta name="theme-color" content="#414bb2" />
			</head>
			<body className={`${zengothic.className} ${bodyClass}`}>
				<header className="text-center z-100">
					<div className="top-0 left-0 right-0 bg-blue-411 text-white text-3xl p-2"
					>{process.env.HTML_TITLE} </div>
				</header>
				<div className={` ${rotateLittleClass} mt-4 ml-4`}>
					{children}
				</div>
				<footer>
					<div className="text-center text-base">
						<p>© 2024 <a target="_blank" href={process.env.TEAM_HOMEPAGE_URL} className="underline">{process.env.TEAM_NAME}</a></p>
					</div>
				</footer>
			</body>
		</html>
	)
}
