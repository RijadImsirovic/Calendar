import React, { useEffect, useState } from "react";
import { Calendar, dayjsLocalizer, Views, View } from "react-big-calendar";
import dayjs from "dayjs";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import YearView from "./YearView";
import Modal from "react-bootstrap/Modal";
import Button from "@mui/material/Button";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { SketchPicker } from "react-color";
import { ChromePicker } from "react-color";
import { HuePicker } from "react-color";
import axios from "../api/axios";
import "./CalendarCo.css";
import { Cookies, useCookies } from "react-cookie";

const localizer = dayjsLocalizer(dayjs);
const DnDCalendar = withDragAndDrop(Calendar);

export default function CalendarCo() {
  const [cookies, setCookie, removeCookie] = useCookies(["Email"]);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [error, setError] = useState(null);
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [modalShow, setModalShow] = React.useState(false);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState("#6287D1"); // define a state for the color prop
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const handleChange = (color) => {
    setColor(color.hex);
    console.log(color.hex);
    console.log(events);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    const response = await axios.post("/addEvent", {
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      color: color,
      email: cookies.Email,
    });

    setEvents([
      ...events,
      {
        start: startDate,
        end: endDate,
        title: title,
        description: description,
        color: color,
      },
    ]);

    setModalShow(false);
    setTitle("Title");
    setDescription("Description...");
  };

  const getEvents = async () => {
    try {
      const url = `/getEvents/${userEmail}`; 

      const response = await axios.get(url);
      console.log(response.data.events)
      if (response.data.detail) {
        setError(response.data.detail);
      } else {
        const formattedEvents = response.data.events.map((event) => ({
          ...event,
          start: new Date(dayjs(event.start).format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ')),
          end: new Date(dayjs(event.end).format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ')),
        }));
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authToken) {
      getEvents();
      console.log(events);
    }
  }, []);

  return (
    <div className="Calendar">
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Schedule an Event
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
            Add an event
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="add-event-body">
          <TextField
            className="add-event-body-item"
            label="Title"
            id="title-field"
            defaultValue="Title"
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            className="add-event-body-item"
            id="Description"
            label="Description"
            multiline
            rows={5}
            defaultValue="My Description...."
            onChange={(e) => setDescription(e.target.value)}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              className="add-event-body-item"
              label="Start Date"
              onChange={(e) => setStartDate(e.toDate())}
            />
            <DateTimePicker
              className="add-event-body-item"
              label="End Date"
              onChange={(e) => setEndDate(e.toDate())}
            />
          </LocalizationProvider>

          <div className="add-event-body-item pick-color">
            <p>Event color: </p>
            <div className="swatch" onClick={() => setDisplayColorPicker(true)}>
              <div className="color" style={{ background: color }} />
            </div>
            {displayColorPicker == true ? (
              <div className="popover">
                <div
                  className="cover"
                  onClick={() => setDisplayColorPicker(false)}
                />
                <SketchPicker color={color} onChange={handleChange} />
              </div>
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
          <Button onClick={(e) => handleAddEvent(e)}>Save</Button>
        </Modal.Footer>
      </Modal>

      <DnDCalendar
        localizer={localizer}
        defaultView={Views.WEEK}
        view={view}
        date={date}
        onView={(view) => setView(view)}
        onNavigate={(date) => setDate(date)}
        events={events}
        views={{
          month: true,
          day: true,
          week: true,
          year: YearView,
        }}
        messages={{ year: "Year" }}
        style={{ height: "65vh" }}
        eventPropGetter={(event) => {
          return {
            style: {
              backgroundColor: event.color,
            },
          };
        }}
      />
    </div>
  );
}
