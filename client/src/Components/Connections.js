import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
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
  const [friendships, setFriendships] = useState([]);

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
      setFriendships(response.data.friendships);

      console.log(sentReq);
      console.log("test");
    } catch (err) {
      console.error(err);
    }
  };

  const cancelFriendRequest = async (receiver) => {
    const response = await axios.post("/cancelFriendRequest", {
      senderId: cookies.Email,
      receiverId: receiver,
    });
    getFriendRequestInfo();
  };

  const rejectFriendRequest = async (sender, receiver) => {
    const response = await axios.post("/cancelFriendRequest", {
      senderId: sender,
      receiverId: receiver,
    });
    getFriendRequestInfo();
  };

  const removeFriend = async (sender, receiver) => {
    const response = await axios.post("/removeFriend", {
      senderId: sender,
      receiverId: receiver,
    });
    getFriendRequestInfo();
  };

  const acceptFriendRequest = async (sender, receiver) => {
    const response = await axios.post("/acceptFriendRequest", {
      senderId: sender,
      receiverId: receiver,
    });
    getFriendRequestInfo();
  };

  useEffect(() => {
    getFriendRequestInfo();
  }, []);

  return (
    <div className="home-container">
      <Nav />
      <div className="connections-content-container">
        <div className="top-section">
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
                {/* <ConnectionsList /> */}
                <Paper elevation={3} style={{ padding: "16px", width: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    Connections
                  </Typography>
                  <Divider />
                  <List>
                    {/* Replace with your sent friend requests data */}
                    {friendships.map((item) => (
                      // <li key={item.id}>{item.name}</li>

                      <ListItem>
                      <ListItemText>{item.friend_name}</ListItemText>
                        {/* <ListItemText primary={item.friend_name} /> */}
                        <ListItemText primary={item.friend_email} />
                        <ListItemSecondaryAction>
                          <Button
                            className="conn-action-btn"
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              removeFriend(item.friend_email, cookies.Email)
                            }
                          >
                            Remove
                          </Button>
                          <Link
                            to={`/profile/${item.friend_email}`}
                            className="conn-action-btn"
                          >
                            <Button variant="outlined" color="secondary">
                              View Profile
                            </Button>
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
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
                          <Button
                            className="conn-action-btn"
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              cancelFriendRequest(item.receiver_mail)
                            }
                          >
                            Cancel
                          </Button>
                          <Link
                            to={`/profile/${item.receiver_mail}`}
                            className="conn-action-btn"
                          >
                            <Button variant="outlined" color="secondary">
                              View Profile
                            </Button>
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </TabPanel>

              <TabPanel value="3" index={2}>
                <Paper elevation={3} style={{ padding: "16px" }}>
                  <Typography variant="h6" gutterBottom>
                    Received Friend Requests
                  </Typography>
                  <Divider />
                  <List>
                    {recReq.map((item) => (
                      <ListItem>
                        <ListItemText primary={item.sender_username} />
                        <ListItemText primary={item.sender_mail} />
                        <ListItemSecondaryAction>
                          <Button
                            className="conn-action-btn"
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              acceptFriendRequest(
                                item.sender_mail,
                                item.receiver_mail
                              )
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            className="conn-action-btn"
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                              rejectFriendRequest(
                                item.sender_mail,
                                item.receiver_mail
                              )
                            }
                          >
                            Decline
                          </Button>
                          <Link
                            to={`/profile/${item.sender_mail}`}
                            className="conn-action-btn"
                          >
                            <Button variant="outlined" color="primary">
                              View Profile
                            </Button>
                          </Link>
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
