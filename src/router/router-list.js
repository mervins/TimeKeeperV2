
import Home from "../Pages/Home/Home";
import Setting from "../Pages/Setting/Setting";
import MiainPage from "../Pages/MainPage";
import Category from "../Pages/Category/Category";
import Stages from "../Pages/Stages/Stages";
import Participants from "../Pages/Participants/Participants";
import Results from "../Pages/Participants/Results";
import NewTabResults from "../Pages/Participants/NewTabResults";
import ReleaseStation from "../Pages/ReleaseStation/ReleaseStation";

const routes = [
    {
        path: "/timer",
        component: ()=> <MiainPage/>,
        title: "Homepage",
        layout: "default",
        access: {
            global: true,
        },  
    },
    {
        path: "/releaseTime",
        component: ()=> <ReleaseStation/>,
        title: "ReleaseTime",
        layout: "default",
        access: {
            global: true,
        },  
    },
    {
        path: "/",
        component: ()=> <Home/>,
        title: "Homepage",
        layout: "default",
        access: {
            global: true,
        },   
    },
    {
        path: "/setting",
        component: ()=> <Setting/>,
        title: "Setting",
        layout: "default",
        access: {
            global: true,
        },   
    },
    {
        path: "/category",
        component: ()=> <Category/>,
        title: "Category",
        layout: "default",
        access: {
            global: true,
        },   
    },
    {
        path: "/stages",
        component: ()=> <Stages/>,
        title: "Stages",
        layout: "default",
        access: {
            global: true,
        },   
    },
    {
        path: "/participants",
        component: ()=> <Participants/>,
        title: "Participants",
        layout: "default",
        access: {
            global: true,
        },   
    },
    {
        path: "/results",
        component: ()=> <Results/>,
        title: "Results",
        layout: "default",
        access: {
            global: true,
        },   
    },
    {
        path: "/new-tab-results",
        component: ()=> <NewTabResults/>,
        title: "Results",
        layout: "default",
        access: {
            global: true,
        },   
    },
    {
        path: "*",
        component: () => <Home/>,
        title: "Redirect to Home",
        layout: "default",
        access: {
            global: true,
        },
    },

];

export default routes;