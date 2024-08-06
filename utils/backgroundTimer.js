import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_TIMER_TASK = 'BACKGROUND_TIMER_TASK';

TaskManager.defineTask(BACKGROUND_TIMER_TASK, async () => {
    try {
        const currentTime = await AsyncStorage.getItem('timeLeft');
        console.log('Background task running, current time:', currentTime);
        if (currentTime !== null) {
            const newTime = Math.max(parseInt(currentTime) - 1, 0);
            await AsyncStorage.setItem('timeLeft', newTime.toString());
            console.log('Updated time in background:', newTime);
        }
        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
        console.error('Background task error:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

export const registerBackgroundTask = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    console.log('BackgroundFetch status:', status);

    if (status === BackgroundFetch.BackgroundFetchStatus.Restricted || status === BackgroundFetch.BackgroundFetchStatus.Denied) {
        console.log('Background execution is disabled');
        return;
    }

    await BackgroundFetch.registerTaskAsync(BACKGROUND_TIMER_TASK, {
        minimumInterval: 60 * 15, // 15 Min - Minimum interval in seconds
        stopOnTerminate: false, // Continue task after app is terminated
        startOnBoot: true, // Start task after device reboot
    });
    console.log('Background task registered');
};

export const unregisterBackgroundTask = async () => {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TIMER_TASK);
    console.log('Background task unregistered');
};
