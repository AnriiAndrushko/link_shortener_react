export default async function postNewUrl(tableName, userIP, url){
    const res = await fetch("/api/"+tableName+"/url",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({url:url, userIP:userIP,}),
    });
    return  await res.json()
}