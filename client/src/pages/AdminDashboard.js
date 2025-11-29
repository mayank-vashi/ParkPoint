import { useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import deleteIcon from "../delete.png";
import { ToastContainer,toast } from "react-toastify";

export default function AdminDashboard() {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [checkinBookings, setCheckinBookings] = useState([]);
  const [checkoutBookings, setCheckoutBookings] = useState([]);
  const [checkinSearch, setCheckinSearch] = useState('');
  const [checkoutSearch, setCheckoutSearch] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchCheckinBookings = async() => {
    setLoading1(true);
    const res = await fetch(`${process.env.REACT_APP_API}/bookings/all/${false}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // setCheckinBookings(data);
      setCheckinBookings(data.map(b => ({...b,buttonStatus:true})));
      setLoading1(false);
  };
  const fetchCheckoutBookings = async() => {
    setLoading2(true);
    const res = await fetch(`${process.env.REACT_APP_API}/bookings/all/${true}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // setCheckoutBookings(data);
      setCheckoutBookings(data.map(b => ({...b,buttonStatus:true})));
      setLoading2(false);
  };

  useEffect(() => {
    fetchCheckinBookings();
    fetchCheckoutBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const cancelBooking = async (bookingId) => {
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
      fetchCheckinBookings(); // Refresh list
      toast.success("Booking Cancelled");
    } else {
      toast.error(`${data.error}`);
    }
};

const cancelCheckoutBooking = async (bookingId) => {
  await fetch(`${process.env.REACT_APP_API}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Check-out Successful");
    fetchCheckoutBookings(); // Refresh list
};

  const makeOverDuePayment = async (booking) => {

    const d1=new Date(booking.endTime);
    const diffTime = Math.abs(new Date() - d1);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    
    // 1️⃣ Create Razorpay order
    const orderRes = await fetch(`${process.env.REACT_APP_API}/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: diffHours*100 }), // test amount in paise
    });

    const orderData = await orderRes.json();

    if (!orderData.id) {
      toast.error("Could not initiate payment");
      return;
    }

    // 2️⃣ Open Razorpay payment window
    const options = {
      key: "rzp_test_d6r8AzYydGBndT", // Your Razorpay test key here
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Parking Management",
      description: "Slot Booking Payment",
      order_id: orderData.id,
      handler: async function (response) {
        cancelCheckoutBooking(booking._id);
        fetchCheckoutBookings();
      },
      theme: { color: "#3399cc" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }
    
  const checkout = async (booking) => {
    const d1=new Date(booking.endTime);
    if(new Date() < d1)
      cancelCheckoutBooking(booking._id);
    else
      setCheckoutBookings(prev =>prev.map(b => b._id === booking._id? { ...b, overdueStatus: true}: b));

  }

  const reallocate = (booking) => {
    navigate('/book',{state : {
      id:booking._id,
      name:booking.user.name,
      email:booking.user.email,
      vehicleNumber:booking.user.vehicleNumber,
      vehicleType:booking.user.vehicleType,
      vehicleModel:booking.user.vehicleModel,
      endTime:booking.endTime}});
  }

  const changeCheckinStatus = async (booking) => {
    try {
      // 1. Create a new checkin entry    
      const checkin = await fetch(`${process.env.REACT_APP_API}/bookings/changeCheckinStatus/${booking._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      console.log(checkin);
      toast.success("Check-in Successful");

      fetchCheckinBookings();
      fetchCheckoutBookings();

    } catch (error) {

      toast.error("Error during checkin process");
    }
  };


  const checkSlot = async (booking) => {

      const res = await fetch(`${process.env.REACT_APP_API}/bookings/check/${booking.slot._id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    const data = await res.json();
    // console.log(data);

    setCheckinBookings(prev =>prev.map(b => b._id === booking._id? { ...b, slotStatus: data ? "busy" : "free",buttonStatus:false}: b));

    // setCheckSlotStatus(false);

  };


  const filteredCheckinBookings = checkinBookings.filter(b =>
    b.user?.email?.toLowerCase().includes(checkinSearch.toLowerCase())
  );
  const filteredCheckoutBookings = checkoutBookings.filter(b =>
    b.user?.email?.toLowerCase().includes(checkoutSearch.toLowerCase())
  );

  return (
    <div className="h-[618px] p-[40px] bg-[#f3f4f6] grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className=" bg-white p-6 rounded-2xl shadow-xl border-t-4 border-[#512B81] h-fit sticky top-12">
        <div className="text-2xl font-bold mb-2">Bookings</div>
        <input type="text" placeholder="Search by Email..." value={checkinSearch} onChange={(e) => setCheckinSearch(e.target.value)} className="mb-6 px-4 py-2 border rounded w-full"/>
        <div className="text-gray-500 italic">(Bookings appear here only if they are eligible for check-in)</div>
        {loading1 ? (
            <div className="flex justify-center items-center py-[200px]">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          ) : (filteredCheckinBookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="h-[337px] overflow-y-auto m-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCheckinBookings.map(booking => (
                <div key={booking._id} className="group inline-block relative border rounded-lg p-4 shadow hover:shadow-md transition">
                  <p><strong>👤 Name:</strong> {booking.user?.name}</p>
                  <p><strong>📧 Email:</strong> {booking.user?.email}</p>
                  <p><strong>🅿️ Slot:</strong> {booking.slot?.slotNumber}</p>
                  <p><strong>Vehicle Info:</strong></p>
                  <div className="border p-2 my-2 rounded bg-gray-50">
                    <p><strong>Registration Number:</strong> {booking.user?.vehicleNumber}</p>
                    <p><strong>Type:</strong> {booking.user?.vehicleType}</p>
                    <p><strong>Model:</strong> {booking.user?.vehicleModel}</p>
                  </div>
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
                  
                  {booking.slotStatus === "busy" && (
                    <p className="text-red-500 font-medium">This slot is already occupied.</p>
                  )}
                  {booking.slotStatus === "free" && (
                    <p className="text-green-600 font-medium">This slot is free. You can check in.</p>
                  )}
                  {booking.slotStatus === undefined && (
                    <p className="text-gray-500 italic">(Check slot status)</p>
                  )}

                  <div class="flex justify-end gap-1">
                    {booking.buttonStatus && <button onClick={() => checkSlot(booking)} className="mt-3 bg-[#512B81] text-white hover:bg-[#6744A3] px-4 py-1 rounded">Check Slot</button>}
                    {booking.slotStatus === "busy" && <button onClick={() => reallocate(booking)} className="mt-3 bg-red-500 text-white hover:bg-red-600 px-4 py-1 rounded">Reassign Slot</button>}
                    {booking.slotStatus === "free" && <button onClick={() => changeCheckinStatus(booking)} className="mt-3 bg-[#512B81] text-white hover:bg-[#6744A3] px-4 py-1 rounded">Check-in</button>}
                  </div>
                  <div className="flex">
                    <div className="w-[30px] h-[30px] hidden group-hover:flex items-center justify-center absolute top-2 right-2 cursor-pointer"><img onClick={() => cancelBooking(booking._id)} src={deleteIcon} alt="not available"/></div>
                  </div>
                </div>
            ))}
            </div>
          </div>
        ))
          }
      </div>
      <div className=" bg-white p-6 rounded-2xl shadow-xl border-t-4 border-[#512B81] h-fit sticky top-12">
        <h1 className="text-2xl font-bold mb-2">Occupancies</h1>
        <input type="text" placeholder="Search by Email..." value={checkoutSearch} onChange={(e) => setCheckoutSearch(e.target.value)} className="mb-6 px-4 py-2 border rounded w-full"/>
        <div className="text-gray-500 italic">(It shows busy slots)</div>

        {loading2 ? (
          <div className="flex justify-center items-center py-[200px]">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : (filteredCheckoutBookings.length === 0 ? (
          <p>No Data found.</p>
        ) : (
          <div className="h-[337px] overflow-y-auto m-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCheckoutBookings.map(booking => (
                <div key={booking._id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
                  <p><strong>👤 Name:</strong> {booking.user?.name}</p>
                  <p><strong>📧 Email:</strong> {booking.user?.email}</p>
                  <p><strong>🅿️ Slot:</strong> {booking.slot?.slotNumber}</p>
                  <p><strong>Vehicle Info:</strong></p>
                  <div className="border p-2 my-2 rounded bg-gray-50">
                    <p><strong>Registration Number:</strong> {booking.user?.vehicleNumber}</p>
                    <p><strong>Type:</strong> {booking.user?.vehicleType}</p>
                    <p><strong>Model:</strong> {booking.user?.vehicleModel}</p>
                  </div>
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
                  {!booking.overdueStatus && <p className="text-gray-500 italic">(Press button to checkout)</p>}
                  {booking.overdueStatus && <p className="text-red-500 font-medium">Overtime Parking.</p>}
                  <div class="flex justify-end gap-1">
                    {!booking.overdueStatus && <button onClick={() => checkout(booking)} className="mt-3 bg-[#512B81] text-white hover:bg-[#6744A3] px-4 py-1 rounded">Checkout</button>}
                    {booking.overdueStatus && <button onClick={() => makeOverDuePayment(booking)} className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded">Penalty</button>}
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))
        }

      </div>
      <ToastContainer position="bottom-left" autoClose={4000} />
    </div>
  );
}
