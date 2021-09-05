import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const drawerWidth = 270;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    backgroundColor: "#318EF0",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

const ActiveLink = ({ href, children }) => {
  const router = useRouter();
  let className = children.props.className || "";

  if (router.pathname === href) {
    className = `${className} activeLink`;
  }

  return <Link href={href}>{React.cloneElement(children, { className })}</Link>;
};

const Dashboard = (props) => {
  const classes = useStyles();
  // const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [menuList, setMenuList] = React.useState([]);
  const handleDrawerOpen = () => {
    props.patchState({ tabSidenav: true });
  };
  const handleDrawerClose = () => {
    props.patchState({ tabSidenav: false });
  };

  React.useEffect(() => {
    if (props.userLogin.myrole == "4") {
      setMenuList([
        {
          pathname: "/home",
          title: "หน้าหลัก",
          icon: "fas fa-home",
        },
        {
          pathname: "/user/request",
          title: "ขอใช้ยานพาหนะ",
          icon: "fas fa-car",
        },
        {
          pathname: "/profile",
          title: "ข้อมูลส่วนตัว",
          icon: "fas fa-id-badge",
        },
      ]);
    } else if (props.userLogin.myrole == "1") {
      setMenuList([
        {
          pathname: "/home",
          title: "หน้าหลัก",
          icon: "fas fa-home",
        },
        {
          pathname: "/user/request",
          title: "ขอใช้ยานพาหนะ",
          icon: "fas fa-car",
        },
        {
          pathname: "/admin/requestcar",
          title: "ตรวจสอบการขอใช้",
          icon: "fas fa-check-square",
        },
        {
          pathname: "/admin/carmanage",
          title: "ยานพาหนะ",
          icon: "fas fa-luggage-cart",
        },
        {
          pathname: "/admin/drivermanage",
          title: "พนักงานขับยานพาหนะ",
          icon: "fas fa-address-card",
        },
        {
          pathname: "/rolemanage",
          title: "จัดการผู้อนุมัติแทน",
          icon: "fas fa-user-tag",
        },
        {
          pathname: "/admin/usermanage",
          title: "ข้อมูลผู้ใช้ในระบบ",
          icon: "fas fa-users-cog",
        },
        {
          pathname: "/admin/static",
          title: "สถิติการใช้ยานพาหนะ",
          icon: "fas fa-chart-area",
        },
        {
          pathname: "/profile",
          title: "ข้อมูลส่วนตัว",
          icon: "fas fa-id-badge",
        },
      ]);
    } else if (props.userLogin.myrole == "2") {
      setMenuList([
        {
          pathname: "/home",
          title: "หน้าหลัก",
          icon: "fas fa-home",
        },
        {
          pathname: "/sol1/requestcar",
          title: "ตรวจสอบการขอใช้",
          icon: "fas fa-check-square",
        },
        {
          pathname: "/rolemanage",
          title: "จัดการผู้อนุมัติแทน",
          icon: "fas fa-user-tag",
        },
        {
          pathname: "/admin/static",
          title: "สถิติการใช้ยานพาหนะ",
          icon: "fas fa-chart-area",
        },
        {
          pathname: "/profile",
          title: "ข้อมูลส่วนตัว",
          icon: "fas fa-id-badge",
        },
      ]);
    } else if (props.userLogin.myrole == "3") {
      setMenuList([
        {
          pathname: "/home",
          title: "หน้าหลัก",
          icon: "fas fa-home",
        },
        {
          pathname: "/sol2/requestcar",
          title: "ตรวจสอบการขอใช้",
          icon: "fas fa-check-square",
        },
        {
          pathname: "/rolemanage",
          title: "จัดการผู้อนุมัติแทน",
          icon: "fas fa-user-tag",
        },
        {
          pathname: "/admin/static",
          title: "สถิติการใช้ยานพาหนะ",
          icon: "fas fa-chart-area",
        },
        {
          pathname: "/profile",
          title: "ข้อมูลส่วนตัว",
          icon: "fas fa-id-badge",
        },
      ]);
    } else if (props.userLogin.myrole == "7") {
      setMenuList([
        {
          pathname: "/home",
          title: "หน้าหลัก",
          icon: "fas fa-home",
        },
        {
          pathname: "/sol3/requestcar",
          title: "ตรวจสอบการขอใช้",
          icon: "fas fa-check-square",
        },
        {
          pathname: "/rolemanage",
          title: "จัดการผู้อนุมัติแทน",
          icon: "fas fa-user-tag",
        },
        {
          pathname: "/admin/static",
          title: "สถิติการใช้ยานพาหนะ",
          icon: "fas fa-chart-area",
        },
        {
          pathname: "/profile",
          title: "ข้อมูลส่วนตัว",
          icon: "fas fa-id-badge",
        },
      ]);
    } else if (props.userLogin.myrole == "5") {
      setMenuList([
        {
          pathname: "/home",
          title: "หน้าหลัก",
          icon: "fas fa-home",
        },
        {
          pathname: "/driver/mywork",
          title: "งานของฉัน",
          icon: "fas fa-car",
        },
        {
          pathname: "/profile",
          title: "ข้อมูลส่วนตัว",
          icon: "fas fa-id-badge",
        },
      ]);
    }

    // setMenuList([
    //   {
    //     pathname: "/home",
    //     title: "หน้าหลัก",
    //     icon: "fas fa-home",
    //   },
    //   {
    //     pathname: "/example/calendar",
    //     title: "Calendar Events",
    //     icon: "fas fa-calendar-alt",
    //   },
    //   {
    //     pathname: "/example/froala",
    //     title: "Froala Editor",
    //     icon: "fas fa-edit",
    //   },
    //   {
    //     pathname: "/example/accordion",
    //     title: "Accordion",
    //     icon: "fas fa-border-all",
    //   },
    //   {
    //     pathname: "/example/table",
    //     title: "Table",
    //     icon: "fas fa-table",
    //   },
    // ]);
  }, []);

  return (
    <React.Fragment>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(
            classes.appBar,
            props.tabSidenav && classes.appBarShift
          )}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                props.tabSidenav && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              ระบบการจองยานพาหนะสำหรับมหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน
              วิทยาเขตนครราชสีมา
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(
              classes.drawerPaper,
              !props.tabSidenav && classes.drawerPaperClose
            ),
          }}
          open={props.tabSidenav}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <div>
            {menuList.map((element, index) => {
              return (
                <ActiveLink href={element.pathname} key={index}>
                  <div
                    className={
                      props.tabSidenav ? "link-theme" : "link-theme text-center"
                    }
                  >
                    <i className={element.icon} style={{ width: "20px" }}></i>
                    {props.tabSidenav && (
                      <span className="ml-3">{element.title}</span>
                    )}
                  </div>
                </ActiveLink>
              );
            })}

            {(() => {
              if (`${props.userLogin.role}`.indexOf("1") != -1) {
                return (
                  <Link href={`/admin/requestcar`}>
                    <div
                      className={
                        props.tabSidenav
                          ? "link-theme"
                          : "link-theme text-center"
                      }
                    >
                      <i
                        className={"fas fa-check-square"}
                        style={{ width: "20px" }}
                      ></i>
                      {props.tabSidenav && (
                        <>
                          <span className="ml-3">{"ตรวจสอบการขอใช้"}</span>
                          <span
                            style={{
                              display: "block",
                              textAlign: "right",
                              color: "#DC3545",
                              fontWeight: "bold",
                            }}
                          >
                            {"(แทนเจ้าหน้าที่)"}
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                );
              }
            })()}

            {(() => {
              if (`${props.userLogin.role}`.indexOf("2") != -1) {
                return (
                  <Link href={`/sol1/requestcar`}>
                    <div
                      className={
                        props.tabSidenav
                          ? "link-theme"
                          : "link-theme text-center"
                      }
                    >
                      <i
                        className={"fas fa-check-square"}
                        style={{ width: "20px" }}
                      ></i>
                      {props.tabSidenav && (
                        <>
                          <span className="ml-3">{"ตรวจสอบการขอใช้"}</span>
                          <span
                            style={{
                              display: "block",
                              textAlign: "right",
                              color: "#DC3545",
                              fontWeight: "bold",
                            }}
                          >
                            {"(แทนผู้อำนวยการกองกลาง)"}
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                );
              }
            })()}

            {(() => {
              if (`${props.userLogin.role}`.indexOf("7") != -1) {
                return (
                  <Link href={`/sol3/requestcar`}>
                    <div
                      className={
                        props.tabSidenav
                          ? "link-theme"
                          : "link-theme text-center"
                      }
                    >
                      <i
                        className={"fas fa-check-square"}
                        style={{ width: "20px" }}
                      ></i>
                      {props.tabSidenav && (
                        <>
                          <span className="ml-3">{"ตรวจสอบการขอใช้"}</span>
                          <span
                            style={{
                              display: "block",
                              textAlign: "right",
                              color: "#DC3545",
                              fontWeight: "bold",
                            }}
                          >
                            {"(แทนผู้มีอำนาจสั่งใช้ยานพาหนะ)"}
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                );
              }
            })()}

            {(() => {
              if (`${props.userLogin.role}`.indexOf("3") != -1) {
                return (
                  <Link href={`/sol2/requestcar`}>
                    <div
                      className={
                        props.tabSidenav
                          ? "link-theme"
                          : "link-theme text-center"
                      }
                    >
                      <i
                        className={"fas fa-check-square"}
                        style={{ width: "20px" }}
                      ></i>
                      {props.tabSidenav && (
                        <>
                          <span className="ml-3">{"ตรวจสอบการขอใช้"}</span>
                          <span
                            style={{
                              display: "block",
                              textAlign: "right",
                              color: "#DC3545",
                              fontWeight: "bold",
                            }}
                          >
                            {"(แทนผู้มีอำนาจสั่งใช้ยานพาหนะ)"}
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                );
              }
            })()}

            <div
              className={
                props.tabSidenav ? "link-theme" : "link-theme text-center"
              }
              onClick={() => {
                window.localStorage.clear();
                window.location.reload();
              }}
            >
              <i
                className={"fas fa-sign-out-alt"}
                style={{ width: "20px" }}
              ></i>
              {props.tabSidenav && <span className="ml-3">{"ออกจากระบบ"}</span>}
            </div>
          </div>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {props.children}
        </main>
      </div>

      <style jsx>{`
        .activeLink {
          color: #318df0;
          background-color: #f0f0f0;
          font-weight: bolder;
        }

        .link-theme {
          padding: 15px;
          cursor: pointer;

          i {
            font-size: 18px;
          }
          span {
            font-size: 16px;
          }

          .divText {
            font-size: 16px;
          }
        }

        .link-theme:hover {
          background-color: #dadada !important;
        }
      `}</style>
    </React.Fragment>
  );
};

export default Dashboard;
