import { AppRouter } from './AppRouter';
import { useAuth } from './context/AuthContext';
import Loader from './components/common/Loader';

function App() {
    const { authInitializing } = useAuth();

    if (authInitializing) {
        return (
            <div className="app-loader">
                <Loader />
            </div>
        );
    }

    return <AppRouter />;
}

export default App;
