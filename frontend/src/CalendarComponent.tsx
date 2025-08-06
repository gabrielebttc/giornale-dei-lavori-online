import React, { useState, useEffect } from 'react';
import { format, isToday, addDays } from 'date-fns';
import { it } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CalendarComponentProps {
    onDateSelect: (date: Date) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateSelect }) => {
    // Utilizza la data odierna come stato iniziale
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Usa useEffect per notificare il genitore ogni volta che la data selezionata cambia
    useEffect(() => {
        onDateSelect(selectedDate);
    }, [selectedDate, onDateSelect]); // L'effetto si attiva quando selectedDate o onDateSelect cambiano

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
                    {format(selectedDate, 'dd MMMM yyyy', { locale: it })} {isToday(selectedDate) && '(oggi)'}
                </span>
                {showDatePicker && (
                    <div className="position-absolute mt-2" style={{ zIndex: 10 }}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            inline
                            locale={it}
                        />
                        <button
                            className="btn btn-sm btn-secondary w-100 mt-2"
                            onClick={handleSetToday}
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