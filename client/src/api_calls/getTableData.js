export default async function getTableData(tableName, userIP){
    const res = await fetch("/api/"+tableName+"/url?userIP="+userIP,{
        method:"GET",
        headers:{
            "content-type":"application/json",
        },
    })
    return await res.json();
}