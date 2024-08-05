// hooks/useWorkoutStats.js
import { useState, useEffect, useContext } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { WorkoutContext } from '../context/WorkoutContext';
import { fetchDailyStats, fetchWeeklyStats } from '../utils/trainingSession';

const useWorkoutStats = () => {
    const { workouts } = useContext(WorkoutContext);
    const [dailyStats, setDailyStats] = useState({});
    const [weeklyStats, setWeeklyStats] = useState({});

    useEffect(() => {
        const loadStats = async () => {
            const stats = await fetchDailyStats();
            setDailyStats(stats);

            const weekly = await fetchWeeklyStats();
            setWeeklyStats(weekly);
        };

        loadStats();
    }, [workouts]);

    return { dailyStats, weeklyStats };
};

export default useWorkoutStats;
