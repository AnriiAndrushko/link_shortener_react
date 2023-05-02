export default async function getUrlByCode(tableName, code){
    const res = await fetch( `/api/${tableName}/${code}`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
        },
    });
    return await res.json();
}