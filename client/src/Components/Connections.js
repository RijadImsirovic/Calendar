import React, { useState } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
} from "@mui/material";
import {
  Tabs,
  Tab,
  Paper,
  Typography,
  Box,
  Toolbar,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useMatch,
  useLocation,
} from "react-router-dom";
import ConnectionsList from "./ConnectionsList";
import Nav from "./Nav";
import "./Connections.css";
import { TabContext } from "@mui/lab";
import TabPanel from "@mui/lab/TabPanel";
import SearchIcon from "@mui/icons-material/Search";
import TopSection from "./TopSection";
import axios from "../api/axios";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

function ConnectionsPage() {
  const [value, setValue] = React.useState("1");
  const history = useNavigate();
  const { path, url } = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [sentReq, setSentReq] = useState([]);
  const [recReq, setRecReq] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getFriendRequestInfo = async () => {
    try {
      const url = `/getPersonalFriendRequestInfo/${cookies.Email}`;

      const response = await axios.get(url);
      console.log(response);

      setSentReq(response.data.sentRequests);
      setRecReq(response.data.receivedRequests);

      console.log(sentReq);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFriendRequestInfo();
  }, []);

  return (
    <div className="home-container">
      <Nav />
      <div className="connections-content-container">
        <div className="top-section">
          {/* <Paper
            className="mario box-1"
            elevation={7}
            style={{ padding: "16px", display: "flex", alignItems: "center" }}
          >
            <Toolbar className="toolbar-search">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search..."
                style={{ flexGrow: 1 }}
                className="search-input"
                sx={{ borderRadius: "25px" }} // Set the border radius here
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton edge="start">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Toolbar>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ marginLeft: "auto" }}
            >
              Welcome back
            </Typography>
          </Paper> */}
          <TopSection />
        </div>
        <div className="main-connections-container">
          <Paper className="connection-tabs" elevation={7}>
            <TabContext value={value}>
              <Tabs
                className="tabs-container"
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  className="tabs-text-container"
                  label="Connections"
                  value="1"
                />
                <Tab
                  className="tabs-text-container"
                  label="Sent requests"
                  value="2"
                />
                <Tab
                  className="tabs-text-container"
                  label="Recieved requests"
                  value="3"
                />
              </Tabs>

              <TabPanel className="account-info-container" value="1" index={0}>
                <ConnectionsList />
              </TabPanel>

              <TabPanel value="2" index={1}>
                <Paper elevation={3} style={{ padding: "16px" }}>
                  <Typography variant="h6" gutterBottom>
                    Sent Friend Requests
                  </Typography>
                  <Divider />
                  <List>
                    {/* Replace with your sent friend requests data */}
                    {sentReq.map((item) => (
                      // <li key={item.id}>{item.name}</li>

                      <ListItem>
                        <ListItemText primary={item.receiver_username} />
                        <ListItemText primary={item.receiver_mail} />
                        <ListItemSecondaryAction>
                          <Button variant="outlined" color="primary">
                            Cancel
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                    {/* Add more list items for sent requests */}
                  </List>
                </Paper>
              </TabPanel>

              {/* CALENDAR */}

              <TabPanel value="3" index={2}>
                <Paper elevation={3} style={{ padding: "16px" }}>
                  <Typography variant="h6" gutterBottom>
                    Received Friend Requests
                  </Typography>
                  <Divider />
                  <List>
                    {/* Replace with your received friend requests data */}
                    {recReq.map((item) => (
                      // <li key={item.id}>{item.name}</li>

                      <ListItem>
                        <ListItemText primary={item.sender_username} />
                        <ListItemText primary={item.sender_mail} />
                        <ListItemSecondaryAction>
                          <Button variant="outlined" color="primary">
                            Accept
                          </Button>
                          <Button variant="outlined" color="secondary">
                            Decline
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </TabPanel>
            </TabContext>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default ConnectionsPage;
