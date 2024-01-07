import dynamic from "next/dynamic";
import { PieChart, Pie, Cell, Text, Label, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C4AF", "#FFBB28", "#FF8042", "#8A54B2"];
// const COLORS = ["#0088FE", "#00C4AF", "#FFBB28", "#FF8042", "FF54CD"];

const renderJson = (json: any[]) => {
    const timestamp: string = (json as any)["timestamp"] || "取得できませんでした";
    const data = (json as any)["data"] || []; // skip below data: 0, 1, 2, 22
    let elements = [];
    for (let i = 0; i <= 22; i++) {
        if ([0, 1, 2, 22].includes(i)) {
            continue;
        }
        const datai = dataPerser(i, data[i] || []);
        const keyi = datai[0];
        const valuei = datai[1];
        elements.push(<h1>・{keyi}</h1>);
        elements.push(makePieChart(keyi, valuei));
    }
    return (
        <div className="z-0"
        >
        最終更新: {timestamp}
        <br />
        本ページは仮実装段階となります。
        <br />
        <br />
        {elements}
    </div>
    );
};

export default renderJson;

const countOccurrences = (arr: any[]) => {
    return arr.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});
};

const convertToOutputFormat = (occurrences: any[]) => {
    const sortedOccurrences = Object.entries(occurrences)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([name, count], index) => ({ name, value: count })); // ここを変更
    return sortedOccurrences;
};

const makePieChart = (key: string, value: any[]) => {
    const occurrences = countOccurrences(value);
    const result = convertToOutputFormat(occurrences);
    return (
        <PieChart width={300} height={300}>
            <Pie
                startAngle={450}
                endAngle={90}
                data={result}
                cx={150}
                cy={150}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={0} /* 輪の隙間 */
                legendType="line"
                dataKey="value"
                nameKey="name"
                label = {true}
                labelLine = {true}
            >
                {result.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                {/* Labelは、グラフの左上に表示される文字です。  */}
                {/* <Label value={key} position="center" /> */}
            </Pie>
            <Legend
            width={300}
            height={300}
            verticalAlign="middle"
            >

            </Legend>

        </PieChart>
    )
};

const dataPerser = (i: number, data: any[]) => {
    let key = data[0];
    let value = data[1];
    let newValue = value;
    if (i === 5 || i === 6) {
        newValue = [];
        // const choices = ["Windows", "Mac OS", "Linux", "その他"];
        // valueの中には複数回答もあるので、それを分割する
        for (let j = 0; j < value.length; j++) {
            const valuej = value[j];
            const valuejSplit = valuej.split(",");
            for (let k = 0; k < valuejSplit.length; k++) {
                newValue.push(valuejSplit[k]);
            }
        }
    }
    return [key, newValue];
};