import { Routes, Route } from "react-router-dom";
import App from "../App";
import Home from "./Home";
import { LocalPage } from "./LocalPage";
import { navigation } from "../config/navigation";
import remotePageRenderer from "../Renderer";

export function AppRoutes() {
  return (
    <>
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="Settings" element={<LocalPage />} />
          
          {navigation.map(nav => (<Route path={nav.name} element={remotePageRenderer(nav.name)} />))}

          <Route path="*" element={<Home />} /> 

          {/* <Route index element={<Home />} /> */}
          {/* <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}

                
           <Route path="*" element={<Home />} /> 
        </Route>
      </Routes>
    </>
  );
}

export default AppRoutes;