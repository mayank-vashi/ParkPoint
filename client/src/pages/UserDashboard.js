import { useEffect, useState } from 'react';
import deleteIcon from "../delete.png";
import { ToastContainer, toast } from "react-toastify";

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('token'); 
  const [loading, setLoading] = useState(false);


  const fetchMyBookings = async() => {
    setLoading(true);
    const res = await fetch(`${process.env.REACT_APP_API}/bookings/my/${false}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setBookings(data);
      setLoading(false);
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    // const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    // if (!confirmCancel) return;

    const res = await fetch(`${process.env.REACT_APP_API}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
  });

  const data = await res.json();

  if (res.ok) {
    toast.success("Booking Cancelled");

    fetchMyBookings(); // Refresh list
  } else {
    toast.error(`${data.error}`);
  }
};

  return (
  <div className="p-6 h-[618px] bg-[#f3f4f6]">
    <h2 className="text-2xl font-bold mb-4">My Booked Slots</h2>
    <div className="text-gray-500 italic">(Expired bookings are automatically cleared from the system)</div>
    {loading ? (
      <div className="flex justify-center items-center py-[200px]">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    ) : (bookings.length === 0 ? (
      <p>No slots booked yet.</p>
    ) : (
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
        
        {bookings.map(booking => (
          <div key={booking._id} className="group relative m-2 inline-block bg-white p-6 rounded-2xl shadow-xl border-t-4 border-[#512B81] h-fit sticky top-12">
              <p>
                <strong>Slot:</strong> {booking.slot.slotNumber}
              </p>
              <p>
                <strong>Begin:</strong>{" "}
                {booking.startTime ? (() => {
                  const d = new Date(booking.startTime);
                  const day = String(d.getDate()).padStart(2, '0');
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const year = d.getFullYear();
                  return `${day}/${month}/${year}`;
                })() : "N/A"}
                , {booking.startTime ? new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}


              </p>
              <p>
                <strong>End:</strong>{" "}
                {booking.endTime ? (() => {
                  const d = new Date(booking.endTime);
                  const day = String(d.getDate()).padStart(2, '0');
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const year = d.getFullYear();
                  return `${day}/${month}/${year}`;
                })() : "N/A"}
                , {booking.endTime ? new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
              </p>
            <div className="flex">
              <div onClick={() => handleCancel(booking._id)}  className="w-[30px] h-[30px] hidden group-hover:flex items-center justify-center absolute top-2 right-2 cursor-pointer"><img src={deleteIcon} alt="not available"/></div>
              
            </div>
          </div>
        ))}
      </div>
    ))
    }
    
    <ToastContainer position="bottom-left" autoClose={4000} />
  </div>
);

}
