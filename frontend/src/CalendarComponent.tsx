import React, { useState } from 'react';
import { format, isToday, addDays, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CalendarComponentProps {
    initialDate: string; // ISO string format
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ initialDate }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(parseISO(initialDate));
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handlePreviousDay = () => {
        setSelectedDate((prevDate) => addDays(prevDate, -1));
    };

    const handleNextDay = () => {
        setSelectedDate((prevDate) => addDays(prevDate, 1));
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setSelectedDate(date);
        }
        setShowDatePicker(false);
    };

    return (
        <div className="d-flex align-items-center justify-content-center">
            <button className="btn btn-outline-primary me-2" onClick={handlePreviousDay}>
                &lt;
            </button>
            <div className="position-relative">
                <span
                    className="fw-bold text-primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                >
                    {format(selectedDate, 'yyyy-MM-dd', { locale: it })} {isToday(selectedDate) && '(oggi)'}
                </span>
                {showDatePicker && (
                    <div className="position-absolute mt-2" style={{ zIndex: 10 }}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            inline
                            locale={it} // Imposta la localizzazione italiana
                        />
                        <button
                            className="btn btn-sm btn-secondary mt-2"
                            onClick={() => {
                                setSelectedDate(new Date()); // Imposta la data odierna
                                setShowDatePicker(false); // Chiude il popup
                            }}
                        >
                            Oggi
                        </button>
                    </div>
                )}
            </div>
            <button className="btn btn-outline-primary ms-2" onClick={handleNextDay}>
                &gt;
            </button>
        </div>
    );
};

export default CalendarComponent;