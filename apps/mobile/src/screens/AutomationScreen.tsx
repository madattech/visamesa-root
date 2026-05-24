import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/RootNavigator';
import {appointmentService} from '../services/appointmentService';
import {Appointment, AutomationProgress, AppointmentSlot} from '../types';
import WebViewAutomation from '../components/WebViewAutomation';

type AutomationScreenRouteProp = RouteProp<RootStackParamList, 'Automation'>;

const AutomationScreen = () => {
  const route = useRoute<AutomationScreenRouteProp>();
  const {case: caseData} = route.params;

  const [appointment, setAppointment] = useState<Appointment | null>(
    caseData.appointment || null,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<AutomationProgress>({
    stage: 'idle',
    message: 'Ready to start automation',
  });

  const refreshAppointmentStatus = useCallback(async () => {
    try {
      const data = await appointmentService.getAppointmentStatus(caseData.id);
      setAppointment(data);
    } catch (error) {
      console.log('No appointment found yet', error);
    }
  }, [caseData.id]);

  useEffect(() => {
    if (caseData.id) {
      refreshAppointmentStatus();
    }
  }, [caseData.id, refreshAppointmentStatus]);

  const handleStartAutomation = () => {
    if (!caseData.profile) {
      Alert.alert('Error', 'Case profile information is missing');
      return;
    }

    setIsRunning(true);
    setProgress({
      stage: 'loading',
      message: 'Starting automation...',
    });
  };

  const handleStopAutomation = () => {
    Alert.alert(
      'Stop Automation',
      'Are you sure you want to stop the automation?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Stop',
          style: 'destructive',
          onPress: () => {
            setIsRunning(false);
            setProgress({
              stage: 'idle',
              message: 'Automation stopped',
            });
          },
        },
      ],
    );
  };

  const handleSlotsFound = async (slots: AppointmentSlot[]) => {
    setProgress({
      stage: 'checking',
      message: `Found ${slots.length} available slot(s)`,
      slotsFound: slots,
    });

    try {
      await appointmentService.checkAvailability({
        caseId: caseData.id,
        slots,
      });
    } catch (error) {
      console.error('Failed to report slots:', error);
    }
  };

  const handleBookingComplete = async (success: boolean, details?: any) => {
    try {
      await appointmentService.recordBookingResult({
        caseId: caseData.id,
        success,
        appointmentDate: details?.date,
        appointmentTime: details?.time,
        location: details?.location,
        confirmationNumber: details?.confirmationNumber,
        errorMessage: details?.error,
      });

      if (success) {
        setProgress({
          stage: 'complete',
          message: 'Appointment successfully booked!',
        });
        Alert.alert(
          'Success!',
          `Your appointment has been booked for ${details?.date} at ${details?.time}`,
        );
      } else {
        setProgress({
          stage: 'error',
          message: 'Booking failed',
          error: details?.error,
        });
        Alert.alert('Booking Failed', details?.error || 'Unknown error');
      }

      await refreshAppointmentStatus();
    } catch (error) {
      console.error('Failed to record booking result:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleError = (error: string) => {
    setProgress({
      stage: 'error',
      message: 'Automation error',
      error,
    });
    Alert.alert('Error', error);
    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'checking':
        return '#007AFF';
      case 'found':
        return '#34C759';
      case 'booked':
        return '#4CAF50';
      case 'failed':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Case Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Case Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{caseData.profile.fullName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Procedure:</Text>
            <Text style={styles.infoValue}>{caseData.procedure.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Passport:</Text>
            <Text style={styles.infoValue}>
              {caseData.profile.passportNumber}
            </Text>
          </View>
        </View>

        {/* Appointment Status */}
        {appointment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointment Status</Text>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: getStatusColor(appointment.status)},
              ]}>
              <Text style={styles.statusBadgeText}>{appointment.status}</Text>
            </View>
            {appointment.date && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date:</Text>
                <Text style={styles.infoValue}>
                  {new Date(appointment.date).toLocaleDateString()}
                </Text>
              </View>
            )}
            {appointment.time && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Time:</Text>
                <Text style={styles.infoValue}>{appointment.time}</Text>
              </View>
            )}
            {appointment.location && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Location:</Text>
                <Text style={styles.infoValue}>{appointment.location}</Text>
              </View>
            )}
          </View>
        )}

        {/* Automation Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Automation Progress</Text>
          <View style={styles.progressContainer}>
            {progress.stage === 'loading' ||
            progress.stage === 'checking' ||
            progress.stage === 'booking' ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : null}
            <Text style={styles.progressMessage}>{progress.message}</Text>
            {progress.error && (
              <Text style={styles.errorText}>{progress.error}</Text>
            )}
            {progress.slotsFound && progress.slotsFound.length > 0 && (
              <View style={styles.slotsContainer}>
                <Text style={styles.slotsTitle}>Available Slots:</Text>
                {progress.slotsFound.map((slot, index) => (
                  <Text key={index} style={styles.slotText}>
                    {slot.date} at {slot.time} - {slot.location}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Control Buttons */}
      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartAutomation}>
            <Text style={styles.buttonText}>Start Automation</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={handleStopAutomation}>
            <Text style={styles.buttonText}>Stop Automation</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Hidden WebView for automation */}
      {isRunning && (
        <WebViewAutomation
          caseData={caseData}
          onProgress={setProgress}
          onSlotsFound={handleSlotsFound}
          onBookingComplete={handleBookingComplete}
          onError={handleError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 10,
    textAlign: 'center',
  },
  slotsContainer: {
    marginTop: 15,
    width: '100%',
  },
  slotsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  slotText: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  controls: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  startButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutomationScreen;
