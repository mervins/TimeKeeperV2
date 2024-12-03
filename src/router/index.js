import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { useEffect,useContext } from "react";
import RoutesList from "../router/router-list";
import { TimerContext } from "../context/TimerContext";
import Toast from "../components/Toast/Toast";

const RouterComponents = ()=>{
    const routes = RoutesList;
    const { deleteToast,listToast } = useContext(TimerContext);
    const renderRoute = (route) => {
        return <Route exact path={ route.path } key={`route-${route.path}`} render={ () => {
            return route.component();
        }}/>;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if ( listToast.length) {
                deleteToast(listToast[0].id);
            }
        }, 1000);
        
        return () => {
            clearInterval(interval);
        }; 
    }, [listToast]);
    const listItem = listToast.map((toast, i) =>    {
        return (
            <Toast key={i} toast={toast} position="top-right"></Toast>
        );
    }        
    );
    return (<>
        {listItem}
        <Router>
            <Switch>
                {
                    routes.map((route) => {
                        return renderRoute(route);
                    })
                }
            </Switch>
        </Router>
    </>);
};

export default RouterComponents;