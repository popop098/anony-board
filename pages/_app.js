import '../styles/globals.css'
import {SessionProvider} from "next-auth/react"
import NextNProgress from "nextjs-progressbar";
import NavBar from "../components/NavBar";
import '@toast-ui/editor/dist/toastui-editor.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function MyApp({Component, pageProps: {session, ...pageProps}}) {
    return (
        <SessionProvider session={session}>
            <ToastContainer style={{maxWidth:"100%"}} limit={3}/>
            <NextNProgress options={{showSpinner: false}}/>
            <NavBar/>
            <Component {...pageProps} />
        </SessionProvider>
    )
}

export default MyApp
