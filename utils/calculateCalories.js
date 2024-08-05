const calculateCalories = (met, weight, durationInSeconds) => {
    const durationInHours = durationInSeconds / 3600;
    return met * weight * durationInHours;
};

export { calculateCalories };