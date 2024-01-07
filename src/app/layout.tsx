import type { Metadata } from 'next'
import { Zen_Kaku_Gothic_New } from "next/font/google";
import './globals.css'

const zengothic = Zen_Kaku_Gothic_New({
	weight: "300",
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
			<head />
			<body className={`${zengothic.className} ${bodyClass}` }>
				<header className="text-center text-5xl">
					<h1 className="font-bold fixed top-0 left-0 right-0 bg-gray-500 text-white text-lg p-2"
					>{process.env.HTML_TITLE} </h1>
				</header>
				<div className={` ${rotateLittleClass} mt-14`}>
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
