import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/layouts/prime.css";
import '../../App.css';
export default function DateRange() {
  const [dates, setDates] = useState(['', '']);
  const [times, setTimes] = useState(['', '']);

  return (
    <>
      <DatePicker
        value={dates}
        onChange={setDates}
        range
        format="DD-MM-YYYY HH:mm:ss"
        numberOfMonths={1}
        inputClass="form-control w-100"
         name="range"
        placeholder="Select Date Time Range"
        plugins={[<TimePicker position="bottom" />]}
      />
    </>
  );
}


// import React, { useState } from "react";
// import DatePicker from "react-multi-date-picker";
// import TimePicker from "react-multi-date-picker/plugins/time_picker";
// import "react-multi-date-picker/styles/layouts/prime.css";
// import '../../App.css';

// export default function DateRange() {
//   // Start of today at 12:00 AM
//   const startOfDay = new Date();
//   startOfDay.setHours(12, 0, 0); // 12:00:00 AM

//   // Current time
//   const now = new Date();

//   // Setting default range
//   const [dates, setDates] = useState([startOfDay, now]);

//   return (
//     <>
//       <DatePicker
//         value={dates}
//         onChange={setDates}
//         range
//         format="DD-MM-YYYY HH:mm:ss"
//         numberOfMonths={1}
//         inputClass="form-control w-100"
//         name="range"
//         placeholder="Select Date Time Range"
//         plugins={[<TimePicker position="bottom" />]}
//       />
//     </>
//   );
// }
