import React, { useEffect } from "react";
import "./TopSection.css";
import { useState } from "react";
import axios from "../api/axios";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import {
  Paper,
  Typography,
  Toolbar,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

const TopSection = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [imageData, setImageData] = useState(null);
  const name = searchQuery;

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      const url = `/searchUsers/${query}`;

      const response = await axios.get(url);
      console.log(response);

      setSearchResults(response.data);
      console.log(searchResults);
    }
  };

  const getProfilePicture = async () => {
    try {
      const url = `/getImage/${cookies.Email}`;

      const response = await axios.get(url, {
        responseType: "arraybuffer", // Indicate that the response is binary data
      });

      const data = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      setImageData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProfilePicture();
  }, []);

  return (
    <Paper
      className="mario box-1 top-section-paper"
      elevation={7}
      style={{ padding: "0px", display: "flex", alignItems: "center" }}
    >
      <Toolbar className="toolbar-search">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          style={{ flexGrow: 1 }}
          className="search-input"
          sx={{ borderRadius: "25px" }} // Set the border radius here
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton edge="start">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
            inputProps: {
              style: {
                background: "transparent !important",
              },
            },
          }}
        />
      </Toolbar>
      <Typography
        variant="body2"
        color="textSecondary"
        className="welcome-back-text"
        style={{ marginLeft: "auto", fontSize: "18px" }}
      >
        Welcome, {cookies.Name}{" "}
        <Avatar
          className="home-profile-image"
          alt="Remy Sharp"
          // src={logo}
          src={`data:image/jpeg;base64,${imageData}`}
        />
      </Typography>
      {searchQuery.length > 0 && (
        <Paper
          elevation={3}
          className="search-div"
          style={{
            marginTop: "16px",
            borderRadius: "25px",
            overflow: "hidden",
          }}
        >
          <List>
            {searchResults.map((user) => (
              <>
                <Link
                  to={`/profile/${user.email}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItem className="search-item" key={user.id}>
                    <ListItemText primary={user.name} />
                  </ListItem>
                </Link>
                <Divider variant="inset" component="li" />
              </>
            ))}
          </List>
        </Paper>
      )}
    </Paper>
  );
};

export default TopSection;
