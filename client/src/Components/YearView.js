import { useMemo } from "react";
import { DateLocalizer, Navigate, ViewProps, Views } from "react-big-calendar";
import Calendar from "react-calendar";
import { Grid, GridItem } from "@chakra-ui/react";
import 'react-calendar/dist/Calendar.css';
import dayjs from "dayjs";

export default function YearView({
  date,
  localizer,
  onView,
  onNavigate,
  events,
}) {
  const currRange = YearView.range(date, { localizer });

  return (
    <Grid className="testingClass" templateColumns={"repeat(4, 1fr)"} gap={6}>
      {currRange.map((month, index) => {
        return (
          <GridItem w="100%" key={index}>
            <Calendar
              activeStartDate={month}
              tileClassName={({ date, view }) => {
                if (
                  view === "month" &&
                  events?.find((event) =>
                    dayjs(event.start).isSame(dayjs(date), "day")
                  )
                )
                  return "event-day";
                return null;
              }}
              onClickDay={(day) => {
                onView && onView(Views.DAY);
                onNavigate(day);
              }}
            />
          </GridItem>
        );
      })}
    </Grid>
  );
}

YearView.range = (date, { localizer }) => {
  const start = localizer.startOf(date, "year");
  const end = localizer.endOf(date, "year");

  const range = [];
  let current = start;

  while (localizer.lte(current, end, "year")) {
    range.push(current);
    current = localizer.add(current, 1, "month");
  }

  return range;
};

YearView.navigate = (date, action, { localizer }) => {
  if (action instanceof Date) return action;

  switch (action) {
    case Navigate.NEXT:
      return localizer.add(date, 1, "year");
    case Navigate.PREVIOUS:
      return localizer.add(date, -1, "year");
    default:
      return date;
  }
};

YearView.title = (date, { localizer }) => {
  return localizer.format(date, "YYYY");
};