import MainHeader from "../../MainHeader/MainHeader";
import Navigation from "../../Navigation/Navigation";
import "../../Layout/Layout.css";
import classes from "../../Navigation/Navigation.module.css";
import ToolTip from "../../UI/ToolTip/ToolTip";
import { NavLink } from "react-router-dom";
import DashboardIcon from "../../UI/Icons/DashboardIcon";
import AddVoterIcon from "../../UI/Icons/AddVoterIcon";
import AddUserIcon from "../../UI/Icons/AddUserIcon";
import UserIcon from "../../UI/Icons/UserIcon";

const ManageUsers = () => {
  return (
    <>
      <div className="wrapper">
        <MainHeader>
          <Navigation>
            <li>
              <ToolTip title="Dashboard" placement="bottom">
                <NavLink to={"/admin/dashboard"}>
                  <div className={` ${classes.link}`}>
                    <div className={classes.link__icon}>
                      <DashboardIcon />
                    </div>

                    <div className={classes.link_title}>Dashboard</div>
                  </div>
                </NavLink>
              </ToolTip>
            </li>

            <li>
              <ToolTip title="Register Voter" placement="bottom">
                <NavLink to={"/admin/register"}>
                  <div className={` ${classes.link}`}>
                    <div className={classes.link__icon}>
                      <AddVoterIcon />
                    </div>

                    <div className={classes.link_title}>Register Voters</div>
                  </div>
                </NavLink>
              </ToolTip>
            </li>

            <li>
              <ToolTip title="Manager Users" placement="bottom">
                <NavLink to={"/admin/manage_users"}>
                  <div className={` ${classes.link} ${classes.current}`}>
                    <div className={classes.link__icon}>
                      <UserIcon />
                    </div>

                    <div className={classes.link_title}>Manage&nbsp;Users</div>
                  </div>
                </NavLink>
              </ToolTip>
            </li>
          </Navigation>
        </MainHeader>

        <div className="content">
          <h1>Manage Users</h1>
        </div>
      </div>
    </>
  );
};
export default ManageUsers;
