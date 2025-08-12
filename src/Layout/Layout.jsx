import React, { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Taptop from "./TapTop";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ThemeCustomize from "../Layout/ThemeCustomizer";
import Footer from "./Footer";
import CustomizerContext from "../_helper/Customizer";
import AnimationThemeContext from "../_helper/AnimationTheme";
import ConfigDB from "../Config/ThemeConfig";
import Loader from "./Loader";
import { MENUITEMS } from "./Sidebar/Menu";

const AppLayout = ({ children, classNames, ...rest }) => {
  const { layout } = useContext(CustomizerContext);
  const { sidebarIconType } = useContext(CustomizerContext);
  const userRole = JSON.parse(localStorage.getItem('role_name'))

  const layout1 = localStorage.getItem("sidebar_layout") || layout;
  const sideBarIcon = localStorage.getItem("sidebar_icon_type") || sidebarIconType;
  const location = useLocation();
  const { animation } = useContext(AnimationThemeContext);
  const animationTheme = localStorage.getItem("animation") || animation || ConfigDB.data.router_animation;

const getParsedLocalStorage = (key, fallback = []) => {
  try {
    const value = localStorage.getItem(key);
    if (!value || value === "undefined" || value === "null") {
      return fallback;
    }
    return JSON.parse(value);
  } catch (err) {
    console.warn(`Failed to parse ${key} from localStorage`, err);
    return fallback;
  }
};

const userFeatures = getParsedLocalStorage("features");

const filterMenuItemsByFeatures = (menuItems, features, role) => {
  if (role === "SuperAdmin") {
    return menuItems;
  }

  return menuItems
    .map(menu => {
      const filteredItems = menu.Items.filter(item =>
        features.includes(item.title)
      );
      return { ...menu, Items: filteredItems };
    })
    .filter(menu => menu.Items.length > 0);
};

const filteredMenuItems = filterMenuItemsByFeatures(MENUITEMS, userFeatures, userRole);

  return (
    <Fragment>
      <Loader />
      <Taptop />
      <div className={`page-wrapper ${layout1}`} sidebar-layout={sideBarIcon} id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar menuItems={filteredMenuItems} />
          <TransitionGroup {...rest}>
            <CSSTransition key={location.key} timeout={100} classNames={animationTheme} unmountOnExit>
              <div className="page-body">
                <div>
                  <div>
                    <Outlet />
                  </div>
                </div>
              </div>
            </CSSTransition>
          </TransitionGroup>
          <Footer />
        </div>
      </div>
      <ThemeCustomize />
      <ToastContainer />
    </Fragment>
  );
};
export default AppLayout;
