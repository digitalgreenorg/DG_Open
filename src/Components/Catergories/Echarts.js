import React, { useEffect } from 'react'
import ReactECharts from "echarts-for-react";
import { useState } from "react";



const Selected = ({ name }) => {
    return <>{name ? <p>{name} selected 🚀</p> : <p>No item selected 🤔</p>}</>;
};
const Echarts = ({ allCat }) => {
    const [name, setName] = useState("");
    const [data, setData] = useState({})
    var index = 0
    var Categories = { name: "Categories", children: [] }



    const options = {
        // tooltip: {
        //   trigger: "item",
        //   triggerOn: "mousemove"
        // },
        series: [
            {
                type: "tree",

                name: "tree1",

                data: [data],

                top: "0%",
                // left: "7%",
                bottom: "10%",
                // right: "60%",

                symbolSize: 20,
                // orient: 'BT',
                label: {
                    position: 'bottom',
                    // rotate: 90,
                    verticalAlign: 'middle',
                    align: 'right',
                    size: "20px"
                },

                leaves: {
                    label: {
                        position: "right",
                        verticalAlign: "middle",
                        align: "left",

                    }
                },

                // https://echarts.apache.org/en/option.html#series-tree.initialTreeDepth
                initialTreeDepth: 2,

                emphasis: {
                    focus: "descendant"
                },

                // roam: "zoom",

                expandAndCollapse: true,

                animationDuration: 550,
                animationDurationUpdate: 750,
            }
        ]
    };

    useEffect(() => {
        for (const [key, value] of Object.entries(allCat)) {
            let obj = {}
            let subcat = []
            obj.name = key
            // obj.key = index++
            console.log(value)
            for (let i = 0; i < value.length; i++) {
                let childObj = {}
                childObj.name = value[i]
                childObj.itemStyle = {
                    borderColor: 'blue'
                }
                subcat.push(childObj)
            }
            obj.children = subcat
            console.log(obj)
            Categories.children.push(obj)
        }
        setData({ ...Categories })
    }, [allCat])


    return (
        <div style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", margin: "auto" }}>
            {/* <Selected name={name} /> */}
            <ReactECharts
                style={{ height: "80vh", width: "80%", margin: "auto" }}
                option={options}
                onEvents={{
                    click: (e) => {
                        setName(e.name);
                    }
                }}
            /></div>
    )
}

export default Echarts