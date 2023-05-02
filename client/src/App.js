import styles from './styles/index.module.css'
import React, {useEffect, useRef, useState} from "react";
import getIP from "./api_calls/getIP";
import getTableData from "./api_calls/getTableData";
import postNewUrl from "./api_calls/postNewUrl";
import getUrlByCode from "./api_calls/getUrlByCode";
import deleteUrlByCode from "./api_calls/deleteUrlByCode";

export default function App() {
    const [data,setData] = useState([]);
    const [newUrl, setNewUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);//currently not used, for future
    let userIP = useRef("All");
    let curTableLink = useRef("short");
    useEffect(()=>{
        updateData();
    },[])

    const updateData = ()=>{
        setIsLoading(true);
        const gettingIP = async ()=>{
            userIP.current = await getIP();
        }
        gettingIP().then(async () => {
            setData(await getTableData(curTableLink.current, userIP.current));
        }).finally(()=>{
            setIsLoading(false);
        });
    }

    const handleOnSubmit = async (e)=> {
        e.preventDefault();
        const _newUrl = newUrl;
        setNewUrl("");
        const content = await postNewUrl(curTableLink.current, userIP.current, _newUrl);
        if(content){
            setData([...data, content]);
        }
    };

    return (
        <>
            <main>
                <div>
                    <h2>Url Shortener</h2>
                    <h3>Your IP: {userIP.current}</h3>

                    <label>Choose a database:</label>
                    <div >
                        <select className={styles.select} onChange={(e)=>{curTableLink.current=e.target.value;updateData();}}>
                            <option value="short">short</option>
                            <option value="small">small</option>
                            <option value="short-link">short-link</option>
                        </select>
                    </div>
                    <form onSubmit={handleOnSubmit}>
                        <div className={styles.group}>
                            <input className={styles.input} pattern="https://.*" type="url" required value={newUrl} onChange={(e)=>{setNewUrl(e.target.value);}}/>
                            <span></span>
                            <span></span>
                            <label className={styles.inputLabel}>Enter your url</label>
                        </div>
                        <button className={styles.button} type="submit">
                            Create Short Url
                        </button>
                    </form>
                </div>
                <div>
                    <table className={styles.refs}>
                        <thead>
                        <tr>
                            <th scope="col">Original URL</th>
                            <th scope="col">Short URL</th>
                            <th scope="col">Owner</th>
                            <th scope="col">Clicked</th>
                            <th scope="col">Delete btn</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            data.map((urlObject)=>(
                                <React.Fragment key = {urlObject.code}>
                                    <tr>
                                        <td>{
                                            <a href={urlObject.url}>
                                                {urlObject.url.slice(0,120)}
                                                {urlObject.url.length>120?"...":""}
                                            </a>
                                        }</td>
                                        <td>
                                            <a href={"/"} onClick={async (e) => {
                                                e.preventDefault();
                                                const url = await getUrlByCode(curTableLink.current, urlObject.code);
                                                data[data.findIndex(el => el.code === urlObject.code)].clicked++;
                                                setData([...data]);
                                                window.open(url, '_blank', 'noreferrer')
                                            }}>
                                                {urlObject.code}
                                            </a>
                                        </td>
                                        <td>
                                            {urlObject.owner}
                                        </td>
                                        <td>
                                            {urlObject.clicked}
                                        </td>
                                        <td>
                                            <button className={styles.button} onClick={async ()=>{
                                                const response = await deleteUrlByCode(curTableLink.current, urlObject.code);
                                                if(response.status===200){
                                                    setData([...data.filter(d=>d.code!==urlObject.code)]);
                                                }
                                            }
                                            }>Delete</button>
                                        </td>

                                    </tr>
                                </React.Fragment>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
}