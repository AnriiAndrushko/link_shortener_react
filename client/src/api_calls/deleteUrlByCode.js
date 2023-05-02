export default async function deleteUrlByCode(tableName, code){
    return await fetch(`/api/${tableName}/${code}`,{
        method:"DELETE",
        headers:{
            "content-type":"application/json"
        },
    });
}