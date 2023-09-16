import React from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import Nav from "./Nav";
import CalendarCo from "./CalendarCo";
import { Paper } from "@mui/material";
import "./Home.css";
import "./Profile.css";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { TabContext } from "@mui/lab";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import AbcIcon from "@mui/icons-material/Abc";
import EmailIcon from "@mui/icons-material/Email";
import PeopleIcon from "@mui/icons-material/People";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import RemoveIcon from "@mui/icons-material/Remove";
import { MenuItem, Select } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "../api/axios";
import Modal from "react-bootstrap/Modal";

const Profile = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const location = useLocation();
  console.log(location);
  const signOut = () => {
    removeCookie("Name");
    removeCookie("Email");
    removeCookie("AuthToken");
    window.location.reload();
  };
  let userName = cookies.Name;
  let userEmail = cookies.Email;

  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [description, setDescription] = useState("");
  const [backupDesc, setBackupDesc] = useState("");
  const [publicCalendar, setPublicCalendar] = useState(false);
  const [backupCal, setBackupCal] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [value, setValue] = React.useState("1");

  const firstToggle = false;

  // ---------------------------- Account Details ----------------------------

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInfoChange = async () => {
    userName = name;
    userEmail = email;
    setBackupDesc(description);
    setBackupCal(publicCalendar);
    console.log(publicCalendar);
    setCookie("Email", userEmail);
    setCookie("Name", userName);

    const response = await axios.post("/infoChange", {
      currentEmail: cookies.Email,
      newEmail: email,
      newName: name,
      newDescription: description,
      newToggle: publicCalendar,
    });
    console.log(response);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    formData.append("email", userEmail);

    const response = await axios.post("/uploadPicture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setModalShow(false);
    getProfilePicture();
    console.log(response);
  };

  const getProfilePicture = async () => {
    try {
      const url = `/getImage/${userEmail}`;

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

  const getProfileSettings = async () => {
    try {
      const url = `/getProfileSettings/${userEmail}`;

      const response = await axios.get(url);

      setDescription(response.data.profileSettings[0].profile_description);
      setBackupDesc(response.data.profileSettings[0].profile_description);
      setPublicCalendar(
        response.data.profileSettings[0].toggle_public_calendar
      );
      setBackupCal(response.data.profileSettings[0].toggle_public_calendar);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProfilePicture();
    getProfileSettings();
  }, []);

  //----------------------------  AVAILABILITY ----------------------------

  const [availability, setAvailability] = useState([
    { day: "Monday", startTime: null, endTime: null },
  ]);

  const handleAddAvailability = () => {
    setAvailability([
      ...availability,
      { day: "Monday", startTime: null, endTime: null },
    ]);
    console.log(availability);
  };

  const handleRemoveAvailability = (index) => {
    const updatedAvailability = [...availability];
    updatedAvailability.splice(index, 1);
    setAvailability(updatedAvailability);
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index][field] = value;
    setAvailability(updatedAvailability);
  };

  // ---------------------------- THEME ----------------------------

  // Define your custom color
  const customGreen = "#46b6a4";
  const customRed = "#b64658";

  // Create a custom theme with the color
  const theme = createTheme({
    palette: {
      primary: {
        main: customRed,
      },
    },
  });

  const greenTheme = createTheme({
    palette: {
      primary: {
        main: customGreen,
      },
    },
  });

  return (
    <div className="home-container">
      <Nav signOut={signOut} />
      <div className="home-content-container profile-content-container">
        <div className="top-section">
          <Paper className="mario box-1" elevation={7}>
            Box 1
          </Paper>
        </div>
        <div className="main-profile-container">
          <Paper className="profile-tabs" elevation={7}>
            <TabContext value={value}>
              <Tabs
                className="tabs-container"
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  className="tabs-text-container"
                  label="Account Details"
                  value="1"
                />
                <Tab
                  className="tabs-text-container"
                  label="Availability"
                  value="2"
                />
                <Tab
                  className="tabs-text-container"
                  label="Calendar"
                  value="3"
                />
              </Tabs>

              <TabPanel className="account-info-container" value="1" index={0}>
                {/* <Avatar className='profile-image' alt="Remy Sharp" src={logo} /> */}
                <Paper className="basic-details" elevation={10}>
                  {/* <div className="basic-details"> */}
                  <div className="basic-title">
                    <h2>Basic account info</h2>
                  </div>
                  <div className="avatar-container">
                    <Avatar
                      className="profile-image"
                      alt="Remy Sharp"
                      // src={logo}
                      src={`data:image/jpeg;base64,${imageData}`}
                    />
                    <Button
                      className="change-profile-image"
                      variant="outlined"
                      onClick={() => setModalShow(true)}
                    >
                      <EditIcon /> Change profile image
                    </Button>

                    <Modal
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      size="lg"
                      className="add-event"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                          Upload a profile picture
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="add-profile-picture">
                        <form
                          onSubmit={(e) => handleImageSubmit(e)}
                          encType="multipart/form-data"
                        >
                          <input
                            type="file"
                            name="avatar"
                            onChange={handleFileChange}
                          />
                          <input type="submit" />
                        </form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button onClick={() => setModalShow(false)}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                  <div className="basic-info">
                    <List className="basic-info-list">
                      <ListItem>
                        <ListItemAvatar>
                          <AbcIcon className="basic-info-icon" />
                        </ListItemAvatar>
                        <span>{name}</span>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemAvatar>
                          <EmailIcon className="basic-info-icon" />
                        </ListItemAvatar>
                        <span>{email}</span>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemAvatar>
                          <PeopleIcon className="basic-info-icon" />
                        </ListItemAvatar>
                        <span>[Connection number]</span>
                      </ListItem>
                    </List>
                  </div>
                  <div className="connection-container"></div>
                  {/* </div> */}
                </Paper>
                <Paper className="edit-details" elevation={10}>
                  <div className="edit-details-title">
                    <h2>Edit account information</h2>
                  </div>
                  <div className="edit-main-container">
                    <TextField
                      label="Name"
                      id="name-field"
                      defaultValue={name}
                      onChange={(e) => setName(e.target.value)}
                      variant="outlined"
                    />
                    <TextField
                      label="Email"
                      id="filled-size-normal"
                      defaultValue={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant="outlined"
                    />
                    <TextField
                      className="Description123"
                      id="Description"
                      label="Description"
                      multiline
                      rows={5}
                      onChange={(e) => setDescription(e.target.value)}
                      defaultValue={description}
                    />
                    <Button className="change-password" variant="outlined">
                      <EditIcon /> Change password
                    </Button>
                    <h3 className="additional-settings-title">
                      Additional settings
                    </h3>
                    <FormControlLabel
                      className="public-switch"
                      control={
                        <Switch
                          defaultChecked={publicCalendar}
                          onClick={(e) => setPublicCalendar(!publicCalendar)}
                        />
                      }
                      label="Allow people other than your connections to view your calendar"
                    />
                  </div>
                  <div className="edit-buttons-container">
                    {name !== userName ||
                    description !== backupDesc ||
                    publicCalendar != backupCal ||
                    email !== userEmail ? (
                      <Button
                        className="change-password"
                        variant="outlined"
                        onClick={handleInfoChange}
                      >
                        Save edit
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </Paper>
                {/* <div className="edit-details"></div> */}
              </TabPanel>

              {/* AVAILABILITY */}

              <TabPanel value="2" index={1}>
                <Paper
                  className="availability-container"
                  elevation={7}
                  style={{ padding: "16px" }}
                >
                  <h2>Availability</h2>
                  {availability.map((slot, index) => (
                    <LocalizationProvider
                      key={index}
                      dateAdapter={AdapterDayjs}
                    >
                      <div className="availability-main">
                        <div className="availability-inputs">
                          <Select
                            className="select-availability"
                            label="Day"
                            variant="outlined"
                            value={slot.day}
                            onChange={(e) =>
                              handleAvailabilityChange(
                                index,
                                "day",
                                e.target.value
                              )
                            }
                          >
                            <MenuItem value="Monday">Monday</MenuItem>
                            <MenuItem value="Tuesday">Tuesday</MenuItem>
                            <MenuItem value="Wednesday">Wednesday</MenuItem>
                            <MenuItem value="Thursday">Thursday</MenuItem>
                            <MenuItem value="Friday">Friday</MenuItem>
                            <MenuItem value="Saturday">Saturday</MenuItem>
                            <MenuItem value="Sunday">Sunday</MenuItem>
                          </Select>

                          <TimePicker
                            className="timepicker-from"
                            label="From"
                            minutesStep={15}
                            variant="outlined"
                            fullWidth
                            value={slot.startTime}
                            onChange={(value) =>
                              handleAvailabilityChange(
                                index,
                                "startTime",
                                value
                              )
                            }
                          />

                          <TimePicker
                            className="timepicker-to"
                            label="To"
                            minutesStep={15}
                            variant="outlined"
                            fullWidth
                            value={slot.endTime}
                            onChange={(value) =>
                              handleAvailabilityChange(index, "endTime", value)
                            }
                          />
                        </div>
                        <div className="availability-input-buttons">
                          <ThemeProvider theme={theme}>
                            <Fab
                              className="remove-availability"
                              color="primary"
                              aria-label="remove"
                              onClick={() => handleRemoveAvailability(index)}
                            >
                              <RemoveIcon />
                            </Fab>
                          </ThemeProvider>
                        </div>
                      </div>
                    </LocalizationProvider>
                  ))}
                  <div className="add-availability-container">
                    {/* <Button variant="outlined" onClick={handleAddAvailability}>
                                            Add Availability
                                        </Button> */}
                    <ThemeProvider theme={greenTheme}>
                      <Fab
                        className="add-availability"
                        color="primary"
                        aria-label="add"
                        onClick={handleAddAvailability}
                      >
                        <AddIcon />
                      </Fab>
                    </ThemeProvider>
                  </div>
                </Paper>
              </TabPanel>

              {/* CALENDAR */}

              <TabPanel value="3" index={2}>
                {/* Item Three */}
                <CalendarCo />
              </TabPanel>
            </TabContext>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Profile;
