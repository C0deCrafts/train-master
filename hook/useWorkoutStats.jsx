import { useState, useEffect, useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';
import { fetchDailyStats } from '../utils/trainingSession';

const useWorkoutStats = () => {
    const { workouts } = useContext(WorkoutContext);
    const [dailyStats, setDailyStats] = useState({});

    useEffect(() => {
        const loadStats = async () => {
            const stats = await fetchDailyStats();
            setDailyStats(stats);
        };

        loadStats();
    }, [workouts]);

    return { dailyStats };
};

export default useWorkoutStats;
