import React, { useState, useEffect } from 'react'
import '../styles/addMarks.css'
import UserDetails from '../components/UserDetails'
import { useNavigate } from 'react-router-dom'


const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString();
}

import YesNoDialog from '../components/YesNoDialog'
import PopupForm from '../components/PopupForm'

export default function AddMarks() {
    const [subject1, setsubject1] = useState("");
    const [subject2, setsubject2] = useState("");
    const [subject3, setsubject3] = useState("");
    const [subject4, setsubject4] = useState("");
    const [subject5, setsubject5] = useState("");

    const navigate = useNavigate();
    const [mark, setMarks] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedMark, setSelectedMark] = useState(null);

    const { user, login, logout } = UserDetails();

    const calculateTotal = () => {
        return (parseFloat(subject1) || 0) +
            (parseFloat(subject2) || 0) +
            (parseFloat(subject3) || 0) +
            (parseFloat(subject4) || 0) +
            (parseFloat(subject5) || 0);
    };
    const total = calculateTotal();

    const email = user.username;
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:7000/add-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, subject1, subject2, subject3, subject4, subject5, total })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error("HTTP Error");
            }
            fetchMarks();
        } catch (error) {
            console.log(error);
        }
    }

    const fetchMarks = async () => {
        try {
            const res = await fetch("http://localhost:7000/fetch-marks", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            setMarks(data.marks);
            if (!res.ok) {
                throw new Error("HTTP Error");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchMarks();
    }, []);

    const deleteMarks = async (id) => {
        try {
            const res = await fetch(`http://localhost:7000/delete-marks/${id}`, {
                method: "DELETE",
                
                headers: {
                    "Content-Type": "application/json",
                },
                // ((prev)=>prev.filter((item)=>item.id!==id))
            });
    
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "HTTP Error");
            }
    
            const data = await res.json();
            fetchMarks();
        } catch (error) {
            console.log("Delete Error:", error);
        }
    };
    
    const editMarks = async (data) => {
        try {
            const res = await fetch(`http://localhost:7000/edit-marks/${data.id}`, {

                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
    
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "HTTP Error");
            }
    
            const responseData = await res.json();
            fetchMarks();
        } catch (error) {
            console.log("Edit Error:", error);
        }
    };

    return (
        <div className='addPageDiv'>
            <div className='addMarks'>
                <h3>Add marks: </h3>
                <form onSubmit={handleSubmit}>
                    <input type="number" placeholder='Enter mark 1' onChange={(e) => setsubject1(e.target.value)} required />
                    <input type="number" placeholder='Enter mark 2' onChange={(e) => setsubject2(e.target.value)} required />
                    <input type="number" placeholder='Enter mark 3' onChange={(e) => setsubject3(e.target.value)} required />
                    <input type="number" placeholder='Enter mark 4' onChange={(e) => setsubject4(e.target.value)} required />
                    <input type="number" placeholder='Enter mark 5' onChange={(e) => setsubject5(e.target.value)} required />
                    <br />
                    <button>Submit</button>
                </form>
            </div>
            <div className='displayMarks'>
                <table className="marksTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>CreatedAt</th>
                            <th>EMail</th>
                            <th>Subject 1</th>
                            <th>Subject 2</th>
                            <th>Subject 3</th>
                            <th>Subject 4</th>
                            <th>Subject 5</th>
                            <th>Total</th>
                            <th colSpan={2}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {mark.map((key, marks) => (
                            <tr key={marks}>
                                <td>{marks+1}</td>
                                <td>{formatTimestamp(key.Created_at)}</td>

                                <td>{key.EMail}</td>
                                <td>{key.Subject1}</td>
                                <td>{key.Subject2}</td>
                                <td>{key.Subject3}</td>
                                <td>{key.Subject4}</td>
                                <td>{key.Subject5}</td>
                                <td>{key.Total}</td>
                                <td><button onClick={() => {
                                  setSelectedMark(key);
                                  setPopupOpen(true);
                                }}>EDIT</button></td>

                                <td><button onClick={() => {
                                    setSelectedMark(key.ID);
                                    setDialogOpen(true);
                                }}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <YesNoDialog 
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={() => {
                    setDialogOpen(false);
                    deleteMarks(selectedMark);
                }}
            />

            <PopupForm
              open={popupOpen}
              onClose={() => setPopupOpen(false)}
              onSubmit={(data) => {
                editMarks({
                  ...data,
                  id: selectedMark.ID
                });
                setPopupOpen(false);
              }}


              selectedMark={selectedMark}
            />

        </div>
    )
}
