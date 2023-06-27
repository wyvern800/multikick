import React, { useEffect  } from 'react';

const Ads = (props) => {
    const { dataAdSlot } = props;  

    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
        catch (e) {
        }
    },[]);

    return (
        <>
            <ins className="adsbygoogle"
                style={{ display: "inline-block", width: "266px", height: "237px" }}
                data-ad-client="ca-pub-5533207782441166"
                data-ad-slot={dataAdSlot}>
            </ins>
        </>
    );
};

export default Ads;