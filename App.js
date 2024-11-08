import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, Alert } from 'react-native';

const TimerApp = () => {
  const [timers, setTimers] = useState([]);
  const [newTimerDuration, setNewTimerDuration] = useState('');


  const formatTime = (timeInSeconds) => {
    const minutes = (timeInSeconds / 60) | 0;
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const addTimer = () => {
    const duration = parseInt(newTimerDuration, 10);
    if (isNaN(duration) || duration <= 0) {
      Alert.alert('Invalid time', 'Please enter a positive number for the timer duration');
      return;
    }
   

    const newTimer = {
      id: Date.now().toString(),
      duration,
      timeLeft: duration,
      isRunning: false,
    };
    setTimers([...timers, newTimer]);
    setNewTimerDuration('');
  };

 
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.isRunning && timer.timeLeft > 0) {
            return { ...timer, timeLeft: timer.timeLeft - 1 };
          } else if (timer.timeLeft === 0 && timer.isRunning) {
            Alert.alert('Timer Done', 'Timer is finished');
            return { ...timer, isRunning: false };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const startTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, isRunning: true } : timer
      )
    );
  };

  const pauseTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, isRunning: false } : timer
      )
    );
  };

  const resetTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, timeLeft: timer.duration, isRunning: false } : timer
      )
    );
  };


  const renderTimer = ({ item }) => (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>Time Left: {formatTime(item.timeLeft)}</Text>
      <View style={styles.buttonContainer}>
        {item.isRunning ? (
          <Button title="Pause" onPress={() => pauseTimer(item.id)} />
        ) : (
          <Button title="Start" onPress={() => startTimer(item.id)} />
        )}
        <Button title="Reset" onPress={() => resetTimer(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Timer App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter time in seconds"
          keyboardType="numeric"
          value={newTimerDuration}
          onChangeText={setNewTimerDuration}
        />
        <Button title="Add Timer" onPress={addTimer} />
      </View>
      <FlatList
        data={timers}
        renderItem={renderTimer}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  timerContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default TimerApp;
