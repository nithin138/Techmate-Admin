import React, { useContext, useState } from 'react';
import { Grid } from 'react-feather';
import { Link } from 'react-router-dom';
import { Image } from '../../AbstractElements';
// import logo from '../../assets/images/logo/image.png';
import logo1 from '../../assets/images/logo/Techmate Logo.png'
// import logo2 from '../../assets/images/logo/techlinklogo.png'
import CustomizerContext from '../../_helper/Customizer';

const SidebarLogo = () => {
  const { mixLayout, toggleSidebar, toggleIcon, layout, layoutURL } = useContext(CustomizerContext);

  const openCloseSidebar = () => {
    toggleSidebar(!toggleIcon);
  };

  const layout1 = localStorage.getItem("sidebar_layout") || layout;

  return (
    <div className='logo-wrapper'>
      {layout1 !== 'compact-wrapper dark-sidebar' && layout1 !== 'compact-wrapper color-sidebar' && mixLayout ? (
        <Link to={`/dashboard`} style={{display:"flex"}}>


          <Image attrImage={{ className: 'img-fluid d-inline', src: `${logo1}`, alt: '' }} />
        </Link>
      ) : (
        <Link to={`/dashboard`}  style={{display:"flex"}}>
   

          <Image attrImage={{ className: 'img-fluid d-inline', src: `${logo1}`, alt: '' }} />
        </Link>
      )}
      {/* <div className='back-btn' onClick={() => openCloseSidebar()}>
        <i className='fa fa-angle-left'></i>
      </div>
      <div className='toggle-sidebar' onClick={openCloseSidebar}>
        <Grid className='status_toggle middle sidebar-toggle' />
      </div> */}
    </div>
  );
};

export default SidebarLogo;
