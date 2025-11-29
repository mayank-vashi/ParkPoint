import { useEffect, useState } from 'react';
import deleteIcon from "../delete.png";
import { ToastContainer, toast } from "react-toastify";

export default function AdminDashboard() {
  const message="";
  const [loading, setLoading] = useState(false);
  const [slotNumber, setSlotNumber] = useState('');
  
  const [slots, setSlots] = useState([]);

  const token = localStorage.getItem('token');

  const fetchSlots = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.REACT_APP_API}/slots`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    data.sort((a, b) => a.slotNumber.localeCompare(b.slotNumber, undefined, { numeric: true }));
    setSlots(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateSlot = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.REACT_APP_API}/slots/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ slotNumber }),
    });

    await res.json();

    if (res.ok) {
      // setMessage(`✅ ${data.message}`);
      toast.success("Slot Created");
      setSlotNumber('');
      fetchSlots();
    } else {
      toast.error("Slot already Exists!");
    }
  };

  const handleDeleteSlot = async (slot) => {

    // const confirmDelete=window.confirm(`Are you sure you want to delete slot ${slot.slotNumber} ?`);
    // if(!confirmDelete) return;

    const res = await fetch(`${process.env.REACT_APP_API}/slots/${slot._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if(data){
      toast.success("Slot Deleted");
      fetchSlots();
    }
    else
      toast.error("Error deleting slot");
  };

  return (

      <div className="h-[617px] p-[40px] bg-[#f3f4f6] flex gap-4">

        <div style={{display: "inline",width:"70%",gap: "10px"}}>
          <h4 className="text-xl font-bold mb-6">Delete Slots</h4>

          {loading ? (
            <div className="flex justify-center items-center py-[200px]">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          ) : (slots.map((slot) => (
            <div className="group inline-block relative">
              <div key={slot._id} style={{margin:"5px",width: "60px",height: "60px",
              backgroundColor: "#39c53eff",display: "inline-flex",alignItems: "center",justifyContent: "center",color: "white",fontWeight: "bold",borderRadius: "8px"}}>{slot.slotNumber}</div>
              <div className="flex">
                <div className="w-[20px] h-[20px] hidden group-hover:flex items-center justify-center absolute top-2 right-2 cursor-pointer"><img onClick={() => handleDeleteSlot(slot)} src={deleteIcon} alt="not available"/></div>
              </div>
            </div>
          )))
          }
          
        </div>

        <div className=" bg-white w-[30%] p-6 rounded-2xl shadow-xl border-t-4 border-[#512B81] h-fit sticky top-12">
          <form onSubmit={handleCreateSlot} className="bg-white rounded">
            <h2 className="text-xl font-bold mb-6">Create Slot</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Slot Number</label>
              <input type="text" value={slotNumber} onChange={(e) => setSlotNumber(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="E.g. A1, P2, B5"/>
            </div>

            <div className="flex">
              <button type="submit" className="flex-1 bg-[#512B81] text-white hover:bg-[#6744A3] font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline">Create Slot</button>
            </div>
          </form>
        </div>
      {message && (
        <div className="mt-4 text-sm font-semibold text-gray-800">
          {message}
        </div>
      )}
      <ToastContainer position="bottom-left" autoClose={4000} />
    </div>
  );
}
