import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buils-client';
import Header from '../components/header';

// it acts like a wrapper around our components
const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <div className="container">
                <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>
    );
};

// here context = { Component, ctx: { req, res } }
AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(
            appContext.ctx,
            client,
            data.currentUser
        );
    }
    return { pageProps, ...data };
}

export default AppComponent;