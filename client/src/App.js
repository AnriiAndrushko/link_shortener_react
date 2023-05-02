import styles from './styles/index.module.css'
import React, { useEffect, useRef, useState } from "react";
import getIP from "./api_calls/getIP";
import getTableData from "./api_calls/getTableData";
import postNewUrl from "./api_calls/postNewUrl";
import UrlTable from './UrlTable';

export default function App() {
    const [data, setData] = useState([]);
    const [newUrl, setNewUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false); //currently not used, for future
    let userIP = useRef("All");
    let curTableLink = useRef("short");

    useEffect(() => {
        updateData();
    }, []);

    const updateData = () => {
        setIsLoading(true);
        const gettingIP = async () => {
            userIP.current = await getIP();
        }
        gettingIP().then(async () => {
            setData(await getTableData(curTableLink.current, userIP.current));
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const _newUrl = newUrl;
        setNewUrl("");
        const content = await postNewUrl(curTableLink.current, userIP.current, _newUrl);
        if (content) {
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
                    <div>
                        <select className={styles.select} onChange={(e) => { curTableLink.current = e.target.value; updateData(); }}>
                            <option value="short">short</option>
                            <option value="small">small</option>
                            <option value="short-link">short-link</option>
                        </select>
                    </div>
                    <form onSubmit={handleOnSubmit}>
                        <div className={styles.group}>
                            <input className={styles.input} pattern="https://.*" type="url" required value={newUrl} onChange={(e) => { setNewUrl(e.target.value); }} />
                            <span></span>
                            <span></span>
                            <label className={styles.inputLabel}>Enter your url</label>
                        </div>
                        <button className={styles.button} type="submit">
                            Create Short Url
                        </button>
                    </form>
                </div>
                <UrlTable data={data} setData={setData} curTableLink={curTableLink} />
            </main>
        </>
    );
}