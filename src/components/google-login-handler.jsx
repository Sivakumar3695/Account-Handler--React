import { useCallback, useContext, useEffect, useState } from "react"
import { AppContext } from "../context/app-context"
import { useAxios, useResponse } from "../utils/request-utils"

export default function GoogleSigninBtn() {

    const [gsiScriptLoaded, setGsiScriptLoaded] = useState(false)
    const {getData, processing, processUrl} = useAxios()
    const appContext = useContext(AppContext)

    useEffect( () => {
        const response = getData();
        if (response && response.status === 200)
            appContext.toggleAuthentication();
        
    }, [processing]) 

    // function decodeJwtResponse (token) {
    //     var base64Url = token.split('.')[1];
    //     var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    //     var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    //         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    //     }).join(''));
    
    //     console.log(jsonPayload);
    //     return JSON.parse(jsonPayload);
    // };

    const initializeGsi = () => {
        
        if (!window.google || gsiScriptLoaded) 
            return
  
        setGsiScriptLoaded(true)
        
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        })

        window.google.accounts.id.prompt()

      }

    const handleGoogleSignIn = useCallback((res) => {

        if (!res.clientId || !res.credential) 
            return

        // const responsePayload = decodeJwtResponse(res.credential);

        const payloadObj = {
            credential: res.credential,
        };

        const actualPayload = Object.keys(payloadObj)
            .map((key, index) => `${key}=${encodeURIComponent(payloadObj[key])}`)
            .join('&');
        
        processUrl({
            method: 'POST',
            url: process.env.REACT_APP_SERVER_URL_BASE + '/tokenlogin/google',
            withCredentials : true,
            data: actualPayload,
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        })
    })

    useEffect(() => {
        if (gsiScriptLoaded) return

        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.onload = initializeGsi
        script.async = true
        script.id = "google-client-script"
        document.querySelector("body")?.appendChild(script)

        return () => {
            // Cleanup function that runs when component unmounts
            window.google?.accounts.id.cancel()
            document.getElementById("google-client-script")?.remove()
        }
    }, [handleGoogleSignIn, initializeGsi])

    return (
        <div className="g-signin-btn-holder">
            <div class="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left"
                data-width="350">
            </div>
        </div>
        // <a href=process.env.REACT_APP_SERVER_URL_BASE + "/oauth2/authorization/google">Sign in with Google</a>
    )

}