import { useEffect, useState } from "react"


export const Imageload = (src: string, timeOutDuration = 2500)=>{
    const [mediaLoaded,setMediaLoaded] = useState(false);

    useEffect(()=>{
        const img = new Image();
        img.src = src;

        if(img.complete){
            setMediaLoaded(true)
        }

        const timeout = setTimeout(()=>setMediaLoaded(true),timeOutDuration);

        return () => clearTimeout(timeout)
    },[src])

    return [mediaLoaded,setMediaLoaded] as const;
}