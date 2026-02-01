import React, { useState, useEffect } from 'react';
import { format, isToday, addDays } from 'date-fns';
import { it } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CalendarComponentProps {
    onDateSelect: (date: Date) => void;
    selectedDate?: Date;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateSelect, selectedDate: externaSelectedDate }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(externaSelectedDate ? externaSelectedDate : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (externaSelectedDate) {
            setSelectedDate(externaSelectedDate);
        }
    }, [externaSelectedDate]);

    useEffect(() => {
        onDateSelect(selectedDate);
    }, [selectedDate, onDateSelect]);

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
    
    // Funzione per impostare la data odierna
    const handleSetToday = () => {
        setSelectedDate(new Date());
        setShowDatePicker(false);
    };

    return (
        <div className="d-flex align-items-center justify-content-between px-2">
            <button className="btn btn-sm btn-light border rounded-circle shadow-sm" onClick={handlePreviousDay}>
                <i className="bi bi-chevron-left"></i>
            </button>
            
            <div className="position-relative text-center mx-2">
                <div 
                className="fw-bold text-primary px-3 py-1 rounded-pill hover-bg-light transition-all" 
                style={{ cursor: 'pointer', fontSize: '0.95rem' }}
                onClick={() => setShowDatePicker(!showDatePicker)}
                >
                <i className="bi bi-calendar3 me-2"></i>
                {format(selectedDate, 'dd MMM yyyy', { locale: it })} {isToday(selectedDate) && '(oggi)'}
                </div>

                {showDatePicker && (
                <div className="position-absolute mt-2 shadow-lg border rounded-4 bg-white p-2" style={{ zIndex: 1100, right: '50%', transform: 'translateX(50%)' }}>
                    <DatePicker
                    selected={selectedDate}
                    onChange={(date) => { handleDateChange(date); setShowDatePicker(false); }}
                    inline
                    locale={it}
                    />
                    <button className="btn btn-sm btn-primary w-100 mt-2 rounded-3" onClick={handleSetToday}>
                    Vai a oggi
                    </button>
                </div>
                )}
            </div>

            <button className="btn btn-sm btn-light border rounded-circle shadow-sm" onClick={handleNextDay}>
                <i className="bi bi-chevron-right"></i>
            </button>
        </div>
    );
};

export default CalendarComponent;