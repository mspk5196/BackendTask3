import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

export default function PopupForm({ open, onClose, onSubmit, selectedMark }) {
    const [subject1, setSubject1] = useState('');
    const [subject2, setSubject2] = useState('');
    const [subject3, setSubject3] = useState('');
    const [subject4, setSubject4] = useState('');
    const [subject5, setSubject5] = useState('');
    const [email, setEmail] = useState('');
    const [total, setTotal] = useState(0);
    const [isTotalCalculated, setIsTotalCalculated] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selectedMark?.ID) {
            fetchEditMarks(selectedMark.ID);
        }
    }, [selectedMark]);

    const calculateTotal = () => {
        const total = (parseFloat(subject1) || 0) +
            (parseFloat(subject2) || 0) +
            (parseFloat(subject3) || 0) +
            (parseFloat(subject4) || 0) +
            (parseFloat(subject5) || 0);
        setTotal(total);
        setIsTotalCalculated(true);
        setErrors(prev => ({ ...prev, total: undefined }));
    };

    const validateFields = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        if (!subject1) newErrors.subject1 = 'Subject 1 is required';
        if (!subject2) newErrors.subject2 = 'Subject 2 is required';
        if (!subject3) newErrors.subject3 = 'Subject 3 is required';
        if (!subject4) newErrors.subject4 = 'Subject 4 is required';
        if (!subject5) newErrors.subject5 = 'Subject 5 is required';
        if (!isTotalCalculated) newErrors.total = 'Total must be calculated';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateFields()) return;
        calculateTotal();

        onSubmit({
            email,
            subject1,
            subject2,
            subject3,
            subject4,
            subject5,
            total
        });
        onClose();
    };

    const handleFieldChange = (setter, field) => (e) => {
        setter(e.target.value);
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const fetchEditMarks = async (id) => {
        try {
            const res = await fetch(`http://localhost:7000/fetch-edit-marks/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            if (res.ok) {
                const marks = data.marks;
                setSubject1(marks.Subject1);
                setSubject2(marks.Subject2);
                setSubject3(marks.Subject3);
                setSubject4(marks.Subject4);
                setSubject5(marks.Subject5);
                setEmail(marks.EMail);
                calculateTotal();
            } else {
                throw new Error(data.error || "Failed to fetch marks");
            }
        } catch (error) {
            console.error("Error fetching marks:", error);
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Marks</DialogTitle>
            
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={email}
                    onChange={handleFieldChange(setEmail, 'email')}
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    margin="dense"
                    label="Subject 1"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={subject1}
                    onChange={handleFieldChange(setSubject1, 'subject1')}
                    error={!!errors.subject1}
                    helperText={errors.subject1}
                />
                <TextField
                    margin="dense"
                    label="Subject 2"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={subject2}
                    onChange={handleFieldChange(setSubject2, 'subject2')}
                    error={!!errors.subject2}
                    helperText={errors.subject2}
                />
                <TextField
                    margin="dense"
                    label="Subject 3"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={subject3}
                    onChange={handleFieldChange(setSubject3, 'subject3')}
                    error={!!errors.subject3}
                    helperText={errors.subject3}
                />
                <TextField
                    margin="dense"
                    label="Subject 4"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={subject4}
                    onChange={handleFieldChange(setSubject4, 'subject4')}
                    error={!!errors.subject4}
                    helperText={errors.subject4}
                />
                <TextField
                    margin="dense"
                    label="Subject 5"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={subject5}
                    onChange={handleFieldChange(setSubject5, 'subject5')}
                    error={!!errors.subject5}
                    helperText={errors.subject5}
                />
            </DialogContent>

            <DialogActions>
                <button onClick={onClose}>CANCEL</button>
                <button onClick={handleSubmit}>UPDATE</button>
            </DialogActions>
        </Dialog>
    );
}
