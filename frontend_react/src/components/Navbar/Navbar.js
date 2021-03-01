import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import TwitterIcon from '@material-ui/icons/Twitter';

function Navbar() {
  return (
    <div className={styles.navbar_container}>
      <div className={styles.links_conatiner}>
        <ul className={styles.ul_links}>
          <Link to="/" style={{ textDecoration: 'None' }}>
            <li className={styles.li_link}><TwitterIcon/></li>
          </Link>
          <Link to="/" style={{ textDecoration: 'None' }}>
            <li className={styles.li_link}>Live Twitter Analysis</li>
          </Link>
          <Link to="/user_analysis" style={{ textDecoration: 'None' }}>
            <li className={styles.li_link}>User Analysis</li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
