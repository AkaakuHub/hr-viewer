import React from "react";
import { PieChart, Pie, Cell, Text, Label, Legend, BarChart, Bar, XAxis, YAxis, ComposedChart, CartesianGrid, ResponsiveContainer } from "recharts";

const COLORS = ["#24A4F3", "#00C4AF", "#FFBB28", "#FF8042", "#8A54B2"];

const renderJson = (json: any) => {
    const splitOthers = (i: number, elements: any[], keyi: string, valuei: any[]) => {
        let newList: any = {};
        for (let j = 0; j < valuei.length; j++) {
            const valueij = valuei[j];
            // Tailwind CSS 4 などもあるので、最後の半角スペースでsplitする
            const name: string = valueij.split(" ").slice(0, -1).join(" ");
            const number: string = valueij.split(" ").slice(-1).join(" ");
            if (!newList[name]) {
                newList[name] = [];
            }
            newList[name].push(number);
        }
        for (const [key, value] of Object.entries(newList)) {
            elements.push(
                <div style={{ margin: 20 }} key={key}>
                    <h1>・{key}</h1>
                    {makeComposedChart(i, key, value as any[])}
                </div>
            );
        }
    }
    const timestamp: string = (json as any)["timestamp"] || "取得できませんでした";
    const data = (json as any)["data"] || [];
    // Element[] を受け入れるように型を設定
    let elements1: React.ReactElement[] = [];
    let elements2: React.ReactElement[] = [];
    let elements2_: React.ReactElement[] = [];
    let elements3: React.ReactElement[] = [];
    let elements3_: React.ReactElement[] = [];
    let elements4: React.ReactElement[] = [];

    let description_data: string[] = [];
    const choice = require("./choice.json");
    for (let i = 1; i <= 5; i++) {
        const data = choice[i];
        description_data.push(data);
    }
    for (let i = 0; i <= 22; i++) {
        if ([0, 1, 2, 22].includes(i)) {
            continue;
        }
        const datai = dataPerser(i, data[i] || []);
        const keyi = datai[0];
        const valuei = datai[1];
        if ([3, 4, 5, 6].includes(i)) {
            elements1.push(
                <div style={{
                    margin: 20
                }} key={keyi}>
                    <h1>・{keyi}</h1>
                    {makePieChart(i, keyi, valuei)}
                </div>
            );

        } else if ([15, 20, 21].includes(i)) {
            if (i === 15) {
                splitOthers(i, elements2_, keyi, valuei);
            }
            if (i === 20) {
                splitOthers(i, elements3_, keyi, valuei);
            }
            if (i === 21) {
                splitOthers(i, elements4, keyi, valuei);
            }

        } else if ([7, 8, 9, 10, 11, 12, 13, 14].includes(i)) {
            elements2.push(
                <div style={{ margin: 20 }} key={keyi}>
                    <h1>・{keyi}</h1>
                    {makeComposedChart(i, keyi, valuei)}
                </div>
            );
        } else if ([16, 17, 18, 19].includes(i)) {
            elements3.push(
                <div style={{ margin: 20 }} key={keyi}>
                    <h1>・{keyi}</h1>
                    {makeComposedChart(i, keyi, valuei)}
                </div>
            );
        }
    }
    return (
        // 要素が横にも縦にも並ぶようにする
        <div key={timestamp}
        >
            データの最終取得時刻: {timestamp}
            <br />
            <br />
            <h1 className="text-2xl"
            >構成人員</h1>
            <ResponsiveContainer width="100%" aspect={3}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}>
                <>{elements1}</>
            </ResponsiveContainer>
            <h1 className="text-2xl"
            >言語について</h1>
            以下の基準で回答を集計しました。<br /><br />
            <ul>
                {description_data.map((value, index) => {
                    return <li key={index}>{value}</li>
                })}
            </ul>
            <h1 className="text-2xl"
            >フロントエンド/バックエンド</h1>
            <ResponsiveContainer width="100%" aspect={3}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}>
                <>{elements2}</>
            </ResponsiveContainer>
            <h1 className="text-2xl"
            >その他</h1>
            <ResponsiveContainer width="100%" aspect={3}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}>
                <>{elements2_}</>
            </ResponsiveContainer>
            <h1 className="text-2xl"
            >インフラ</h1>
            <ResponsiveContainer width="100%" aspect={3}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}>
                <>{elements3}</>
            </ResponsiveContainer>
            <h1 className="text-2xl"
            >その他</h1>
            <ResponsiveContainer width="100%" aspect={3}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}>
                <>{elements3_}</>
            </ResponsiveContainer>
            <h1 className="text-2xl"
            >WEB以外の言語等</h1>
            <ResponsiveContainer width="100%" aspect={3}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}>
                <>{elements4}</>
            </ResponsiveContainer>
        </div>
    );
};

export default renderJson;

const countOccurrences = (i: number, arr: any[]) => {
    if ([7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21].includes(i)) {
        // 1,2,3,4,5の順番で並べる
        // このうちどれかでもかけていたら、要素数0として追加
        const result = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if (element === "1") {
                result["1"] += 1;
            } else if (element === "2") {
                result["2"] += 1;
            } else if (element === "3") {
                result["3"] += 1;
            } else if (element === "4") {
                result["4"] += 1;
            } else if (element === "5") {
                result["5"] += 1;
            } else {
                result["1"] += 1;
            }
        }
        return result;
    } else {
        return arr.reduce((acc, value) => {
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});
    }
};

const convertToOutputFormat = (i: number, occurrences: any[]) => {
    if ([7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21].includes(i)) {
        // 頻度順ではなくて、キーが1,2,3,4,5の順番で並ぶようにする
        const sortedOccurrences = Object.entries(occurrences)
            .sort(([keyA], [keyB]) => parseInt(keyA) - parseInt(keyB))
            .map(([name, count], index) => ({ name, value: count })); // ここを変更
        return sortedOccurrences;

        return sortedOccurrences;
    } else {
        const sortedOccurrences = Object.entries(occurrences)
            .sort(([, countA], [, countB]) => countB - countA)
            .map(([name, count], index) => ({ name, value: count })); // ここを変更
        return sortedOccurrences;
    }

};

const makePieChart = (i: number, key: string, value: any[]) => {
    const occurrences = countOccurrences(i, value);
    const result = convertToOutputFormat(i, occurrences);
    return (
        <PieChart width={300} height={250}>
            <Pie
                startAngle={450}
                endAngle={90}
                data={result}
                cx={150}
                cy={140}
                innerRadius={0}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={0} /* 輪の隙間 */
                legendType="line"
                dataKey="value"
                nameKey="name"
                label={true}
                labelLine={true}
            >
                {result.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Legend
                width={300}
                height={250}
                verticalAlign="middle"
            >
            </Legend>
        </PieChart>
    )
};

const makeComposedChart = (i: number, key: string, value: any[]) => {
    const occurrences = countOccurrences(i, value);
    const result = convertToOutputFormat(i, occurrences);
    return (
        <ComposedChart
            width={300}
            height={250}
            layout="vertical"
            data={result}
        // margin={{
        //     top: 20,
        //     right: 20,
        //     bottom: 20,
        //     left: 20,
        // }}
        >
            <XAxis
                type="number"
                domain={[
                    0,
                    "dataMax",
                ]}
            />
            <YAxis
                type="category"
                dataKey="name"
                width={15}
                tick={{ fontSize: 16 }}
            />
            <CartesianGrid stroke="#f5f5f5" />
            <Bar
                dataKey="value"
                barSize={15}
                stroke="#1FC2FF"
                fill="#24a4f3"
            />
        </ComposedChart>
    )
}

const dataPerser = (i: number, data: any[]) => {
    let key = data[0];
    let value = data[1];
    let newValue = value;
    if ([5, 6, 15, 20, 21].includes(i)) {
        newValue = [];
        for (let j = 0; j < value.length; j++) {
            const valuej = value[j];
            const valuejSplit = valuej.split(",");
            for (let k = 0; k < valuejSplit.length; k++) {
                if (valuejSplit[k].trim() !== "") {
                    newValue.push(valuejSplit[k].trim());
                }
            }
        }
    }
    if ([7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19].includes(i)) {
        // 最初の1文字だけにする
        for (let i = 0; i < value.length; i++) {
            value[i] = value[i].slice(0, 1);
        }
    }
    return [key, newValue];
};
