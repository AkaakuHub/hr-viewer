import React from "react";

const renderJson2 = (json: any) => {
    const timestamp: string = (json as any)["timestamp"] || "取得できませんでした";
    const data = (json as any)["data"] || [];

    // ヘッダーを列に変換
    const NumberOfQ: number = data.length;
    const NumberOfPeople: number = data[0][1].length;

    let data_transposed: any[] = [];
    const dataNew = dataPerserNew(data, NumberOfQ);
    for (let i = 0; i < NumberOfPeople; i++) {
        let thisArray: any[] = [];
        for (let j = 0; j < NumberOfQ; j++) {
            thisArray.push(dataNew[j][0] + "    " + dataNew[j][1][i]);
        }
        data_transposed.push(thisArray);
    }

    let description_data: string[] = [];
    const choice = require("./choice.json");
    for (let i = 1; i <= 5; i++) {
        const data = choice[i];
        description_data.push(data);
    }
    return (
        <div key={timestamp}
            className="mt-4"
        >
            <div className="text-red-500"
            >
                個人情報を含むため絶対に外部に公開しないでください。
            </div>
            データの最終取得時刻: {timestamp}
            <br />
            <br />
            以下の基準で回答を集計しました。<br /><br />
            <ul>
                {description_data.map((value, index) => {
                    return <li key={index}>{value}</li>
                })}
            </ul>
            <br />
            <pre>
                {JSON.stringify(data_transposed, null, 2)}
            </pre>
        </div>

    )
};

export default renderJson2;

const dataPerserNew = (array: any[], numofQ: number) => {
    for (let i = 0; i < numofQ; i++) {
        let key = array[i][0];
        let value = array[i][1];
        if ([7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19].includes(i)) {
            // 最初の1文字だけにする
            for (let j = 0; j < value.length; j++) {
                value[j] = value[j].slice(0, 1);
            }
        } else if ([15, 20, 21].includes(i)) {
            for (let j = 0; j < value.length; j++) {
                value[j] = value[j].replaceAll("\n", " ");
            }
        }
    }
    return array;
};
