import dynamic from "next/dynamic";
import { PieChart, Pie, Cell, Text, Label, Legend, BarChart, Bar, XAxis, YAxis, ComposedChart, CartesianGrid, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C4AF", "#FFBB28", "#FF8042", "#8A54B2"];

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
        if ([3, 4, 5, 6].includes(i)) {
            elements.push(makePieChart(i, keyi, valuei));
        } else if ([15, 20, 21].includes(i)) {
            // valueは、例えば以下のようになっている
            // ["proxmox 3", "AWS 4", "proxmox 4"]
            // これを、以下のように変換する
            // ・proxmox
            // (ここに、proxmoxのグラフ、3のやつと4のやつどっちも)
            // ・AWS
            // ...
            // つまり、valueを、以下のように変換する
            let newList: any = {};
            for (let j = 0; j < valuei.length; j++) {
                const valueij = valuei[j];
                // Tailwind CSS 4 などもあるので、最後の半角スペースでsplitする
                const name: string = valueij.split(" ").slice(0, -1).join(" ");
                const number: string = valueij.split(" ").slice(-1).join(" ");
                console.log(name, "; " , number);
                if (!newList[name]) {
                    newList[name] = [];
                }
            
                newList[name].push(number);
            }
            for (const [key, value] of Object.entries(newList)) {
                elements.push(<h2>・{key}</h2>);
                elements.push(makeComposedChart(i, key, value as any[]));
            }
        } else {
            elements.push(makeComposedChart(i, keyi, valuei));
        }
        if (i === 6) {
            elements.push(<h1>言語について</h1>);
            // ./choice.jsonの内容を表示する
            const choice = require("./choice.json");
            for (let i=1; i<=5; i++){
                const data = choice[i];
                elements.push(<h2>{data}</h2>);
            }
        }
        if (i === 15) {
            elements.push(<h1>サービスについて</h1>);
        }
        // elements.push(makePieChart(keyi, valuei));
    }
    return (
        <div className="z-0 flex flex-wrap justify-center"
            role="region"
            style={{
                position: "relative",
                width: "100%",
            }}
        >
            最終更新: {timestamp}
            <br />
            本ページは仮実装段階となります。
            <br />
            <br />
            <h1>構成人員について</h1>
            <br />
            {elements}
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
                width={100}
                tick={{ fontSize: 16 }}
            />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Bar
                dataKey="value"
                barSize={15}
                stroke="#1FC2FF"
                fill="#414bb2"
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