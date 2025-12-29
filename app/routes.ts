import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/Home.tsx"),
    route(":city", "routes/Search.tsx")
] satisfies RouteConfig;
