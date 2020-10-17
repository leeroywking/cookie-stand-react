import React from "react"

const managerMap = {
3:"John",
6:"Sam",
4:"Robin",
5:"JB",
8:"Brook",
7:"Amanda"
}

export default (props) => {
    const filteredData = props.data.filter(location => {
        if(props.username === "admin"){
            return true
        }
        else if (props.username === managerMap[location.manager]){
            return true
        }
        else {
            return false
        }
    })
    return <table>
        <th>Sales</th>
        <th>Min Customers</th>
        <th>Max Customers</th>
        <th>Average Sales</th>
        <th>
            Store Manager
        </th>
        {filteredData.map(location => {
            return <tr>
                <td>
                    {location.location}
                </td>
                <td>
                    {location.min_customer}
                </td>
                <td>
                    {location.max_customer}
                </td>
                <td>
                    {location.avg_sales}
                </td>
                <td>
                    {managerMap[location.manager]}
                </td>
            </tr>
        })}
    </table>
}