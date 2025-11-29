import React, { useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


export default function BookSlot() {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  // const [showModal, setShowModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [id, setId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availability, setAvailability] = useState({}); // { slotId: true/false }

  const location = useLocation();
  const parameters = location.state;

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const isAdmin = user && JSON.parse(user) === "admin";

  function parseTimeToDate(timeStr,date) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  
  useEffect(() => {
  if (isAdmin) {
    setStartDate(new Date().toISOString().split("T")[0]);
    setStartTime(new Date().toTimeString().slice(0, 5));
    // alert(parameters.name);
    if(parameters){
      setName(parameters.name);
      setEmail(parameters.email);
      setVehicleNumber(parameters.vehicleNumber);
      setVehicleType(parameters.vehicleType);
      setVehicleModel(parameters.vehicleModel);
      setEndDate(new Date(parameters.endTime).toISOString().split("T")[0]);
      setEndTime(new Date(parameters.endTime).toTimeString().slice(0, 5));
      setId(parameters.id);
    }
    // handleAvailableSlots();

  }

}, [isAdmin,parameters]);
  
  async function isAvailable(slotId){
    const token = localStorage.getItem("token");

    try{
      // console.log("checking availabiasdasdality for slot:", slotId, startDate, endDate, startTime, endTime);
      const res = await fetch(`${process.env.REACT_APP_API}/bookings/searchAvailable/${isAdmin}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            slotId:slotId, // send slot ID
            curStart:parseTimeToDate(startTime,new Date(startDate)).toISOString(),
            curEnd:parseTimeToDate(endTime,new Date(endDate)).toISOString()
          }),
        });

        const data = await res.json();
        // console.log(data);

        if(data)
          return false;
        
        return true;
    }
    catch(err){
      console.log(err);
    }
  }

  const cancelBooking = async (bookingId) => {

    await fetch(`${process.env.REACT_APP_API}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // const data = await res.json();
    navigate("/admin");
    // if (res.ok) {
    //   fetchCheckinBookings(); // Refresh list
    // } else {
    //   alert(`❌ ${data.error}`);
    // }
};

  const handleAvailableSlots = async () => {
    
    if (isAdmin && ((!name || !email) || !startDate || !endDate || !startTime || !endTime)) {
      toast.info("Empty fields");
      return;
    }

    if((parseTimeToDate(startTime,new Date(startDate)) >= parseTimeToDate(endTime,new Date(endDate))) || (!isAdmin&&parseTimeToDate(startTime,new Date(startDate)) < new Date())){
      toast.error("Invalid date/time selection");
      setConfirm(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API}/slots`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      
      const newAvailability = {};
      for (const slot of data) {
        newAvailability[slot._id] = await isAvailable(slot._id);
      }
      setAvailability(newAvailability);
      
      data.sort((a, b) => a.slotNumber.localeCompare(b.slotNumber, undefined, { numeric: true }));

      setSlots(data);
      setLoading(false);
      setConfirm(true);

    }
    catch (err) {
      console.error(err);
    }
};


  const handleSlotClick = (slot) => {
    if (availability[slot._id]) {
      setSelectedSlot(slot);
      setSelectedId(slot._id);
    }
    
  };

  const book = async () =>{
    const res = await fetch(`${process.env.REACT_APP_API}/bookings/book/${isAdmin}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name,
            email: email,
            vehicleNumber:vehicleNumber,
            vehicleType:vehicleType,
            vehicleModel:vehicleModel,
            slotId: selectedSlot._id, // send slot ID
            startTime: parseTimeToDate(startTime,new Date(startDate)),
            endTime:parseTimeToDate(endTime,new Date(endDate))
          }),
        });

        await res.json();

        if (res.ok) {
            toast.success("Slot Booked");
          
          handleAvailableSlots();
          setSelectedId("");
          setConfirm(false);
          setSelectedSlot("");
        } 
        else {
          toast.error("Booking failed");
          //setMessage("❌ Booking failed(outer) : " + data.error);
        }
        
  }

  const handleConfirmBooking = async () => {
    if(!selectedSlot) {
      toast.info("Please select a slot first");
      return;
    }
    if (isAdmin && ((!name || !email || !vehicleNumber || !vehicleType || !vehicleModel) || !startDate || !endDate || !startTime || !endTime)) {
        toast.info("Empty fields");

      return;
    }
    

    const d1=new Date(parseTimeToDate(startTime,new Date(startDate)));
    const d2=new Date(parseTimeToDate(endTime,new Date(endDate)));
    const diffTime = Math.abs(d2 - d1);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if(parameters){
      book();
      cancelBooking(id);
      navigate("/admin");
      return;
    }
    // 1️⃣ Create Razorpay order
    const orderRes = await fetch(`${process.env.REACT_APP_API}/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: diffHours*10 }), // test amount in paise
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
      name: "ParkPoint",
      description: "Slot Booking Payment",
      order_id: orderData.id,
      handler: async function (response) {
        book();
        
      },
      theme: { color: "#512B81" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
      <div class=" w-full bg-[#f3f4f6] p-10 flex h-[618px]">
        <div style={{display: "inline",width:"72%",gap: "10px"}}>
          <p className="text-red-500 font-medium">Normal Price : ₹10/hour | Overtime Penalty : ₹100/hour</p>
          {loading ? (
            <div className="flex justify-center items-center py-[200px]">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          ) : (slots.map((slot) => (
            <div key={slot._id} onClick={() => handleSlotClick(slot)} style={{margin:"5px",width: "60px",height: "60px",
              backgroundColor: availability[slot._id] ? "#39c53eff":"#d6d6d6ff",
              display: "inline-flex",alignItems: "center",justifyContent: "center",color: "white",fontWeight: "bold",borderRadius: "8px",
              cursor: availability[slot._id] ? "pointer":"not-allowed",
              border: selectedId === slot._id ? "3px solid red" : "3px solid transparent"}}>{slot.slotNumber}</div>
          )))
          }
        </div>

        <div className="lg:w-1/3 bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-[#512B81] h-fit sticky top-12">
          {isAdmin && 
          <>
            {!parameters && <>
                <div className="space-y-4">
                  <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />

                  <select value={vehicleType} required onChange={(e) => setVehicleType(e.target.value)} className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="NA">Select vehicle type</option>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                    <option value="Scooter">Scooter</option>
                  </select>

                  <input type="text" placeholder="Vehicle Number" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" /><input type="text" placeholder="Vehicle Model" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div><br/>
              </>
            }</>
          }
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Begin:</label>
          {isAdmin ? 
          <>
          <input type="date" value={new Date().toISOString().split("T")[0]} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled/><input type="time" value={new Date().toTimeString().slice(0, 5)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled/>
          </>
          :
          <>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
          </>}
          <br/><br/>
          {
            parameters ? 
            <>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>End:</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled/><input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled/><br/><br/>
            </>
            :
            <>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>End:</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/><input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/><br/><br/>
            </>
          }
          
          <div class="flex gap-2">
            <button onClick={handleAvailableSlots} class="flex-1 bg-[#512B81] text-white hover:bg-[#6744A3] px-3 py-1 rounded">Check Available Slots</button>
            <>
            {confirm && <button onClick={handleConfirmBooking} class="flex-1 bg-[#512B81] text-white hover:bg-[#6744A3] px-3 py-1 rounded">Confirm Booking</button>}
            {!confirm && <button class="flex-1 text-white bg-gray-300 px-3 py-1 rounded" disabled>Confirm Booking</button>}
            </>
          </div>
          
        </div>
        <ToastContainer position="bottom-left" autoClose={4000} />
      </div>
    
      
  );
}
