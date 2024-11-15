import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import RoutesList from "../router/router-list";

const RouterComponents = ()=>{
    const routes = RoutesList;
    
    const renderRoute = (route) => {
        return <Route exact path={ route.path } key={`route-${route.path}`} render={ () => {
            return route.component();
        }}/>;
    };

    return (<>
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