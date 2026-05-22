import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BookTable = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [guests, setGuests] = useState('2');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const timeSlots = [
    '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', 
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!date || !timeSlot || !guests) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.post('/api/bookings', { date, timeSlot, guests: Number(guests) }, config);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book table. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full border border-gray-100"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-8">
            Your table has been reserved for {date} at {timeSlot}. We look forward to seeing you!
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full btn-primary"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Reserve a Table</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Guarantee your spot in the food court. Book ahead for dates, meetings, or family dinners.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        {/* Left side image/info */}
        <div className="md:w-5/12 bg-primary-600 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Fast & Easy Booking</h2>
            <p className="text-primary-100 mb-8 leading-relaxed">
              Skip the wait times during peak hours. Choose your date, select a time, and we'll have a table ready for you.
            </p>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3 bg-primary-700/50 p-4 rounded-xl">
              <CalendarDays className="text-primary-200" />
              <span>Book up to 30 days in advance</span>
            </div>
            <div className="flex items-center gap-3 bg-primary-700/50 p-4 rounded-xl">
              <Users className="text-primary-200" />
              <span>Groups up to 10 people</span>
            </div>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white opacity-10"></div>
        </div>

        {/* Right side form */}
        <div className="md:w-7/12 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarDays className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-3 px-4 text-sm font-medium rounded-xl border transition-all ${
                      timeSlot === slot 
                        ? 'bg-primary-600 border-primary-600 text-white shadow-md' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg mt-8"
            >
              {loading ? 'Processing...' : (user ? 'Confirm Booking' : 'Login to Book')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookTable;
