import Header from '../Header/Header';

const Layout = ({children}) => {
    return (
        <>
            <Header/>
            {children}
            <h1>Footer</h1>
        </>
    )
}

export default Layout;