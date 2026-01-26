import AdminDashboardContent from "./AdminDashboardContent";
import MainHeader from "../../MainHeader/MainHeader";
import Navigation from "../../Navigation/Navigation";
import "../../Layout/Layout.css";
import classes from "../../Navigation/Navigation.module.css";
import ToolTip from "../../UI/ToolTip/ToolTip";
import { NavLink } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <>
      <div className="wrapper">
        <MainHeader>
          <Navigation>
            <li>
              <ToolTip title="Report" placement="bottom">
                <NavLink to={"/admin/dashboard"}>
                  <div className={` ${classes.link} `}>
                    <div className={classes.link__icon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                        />
                      </svg>
                    </div>

                    <div className={classes.link_title}>Report</div>
                  </div>
                </NavLink>
              </ToolTip>
            </li>
          </Navigation>
        </MainHeader>

        <div className="content">
          <AdminDashboardContent />
        </div>
      </div>
    </>
  );
};
export default AdminDashboard;
