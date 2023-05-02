import React from "react";
import styles from './styles/index.module.css';
import getUrlByCode from "./api_calls/getUrlByCode";
import deleteUrlByCode from "./api_calls/deleteUrlByCode";

export default function UrlTable(props) {
    const { data, setData, curTableLink } = props;
    const handleOnClick = async (e, urlObject) => {
        e.preventDefault();
        const url = await getUrlByCode(curTableLink.current, urlObject.code);
        data[data.findIndex(el => el.code === urlObject.code)].clicked++;
        setData([...data]);
        window.open(url, '_blank', 'noreferrer')
    };

    const handleOnDelete = async (urlObject) => {
        const response = await deleteUrlByCode(curTableLink.current, urlObject.code);
        if(response.status===200){
            setData([...data.filter(d=>d.code!==urlObject.code)]);
        }
    }

    return (
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
                                    <a href={"/"} onClick={(e) => handleOnClick(e, urlObject)}>
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
                                    <button className={styles.button} onClick={() => handleOnDelete(urlObject)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
}