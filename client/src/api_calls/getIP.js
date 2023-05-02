

export default async function getIP() {

    // if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){    //This used to test on dev server and not run build every time
    //     let data;
    //     try {
    //         const response = await fetch('https://geolocation-db.com/json/');
    //         data = await response.json();
    //     }catch (err){
    //         console.log(err);
    //     }
    //     return data?data.IPv4:"All";
    // }else{
    let ip;
    try {
        const response = await fetch("/api/getIP",{
            method:"GET",
            headers:{
                "content-type":"application/json",
            },
        });
        ip = await response.json()
    }catch (err){
        console.log(err);
    }
    return ip?ip:"All";
    // }
}