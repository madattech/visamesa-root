import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../contexts/AuthContext';
import {appointmentService} from '../services/appointmentService';
import {Case} from '../types';
import {RootStackParamList} from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CaseListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {user, logout} = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCases = useCallback(async () => {
    if (!user) return;

    try {
      const data = await appointmentService.getAllCases(user.id);
      setCases(data);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to fetch cases',
      );
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCases();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', style: 'destructive', onPress: logout},
    ]);
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

  const getStatusText = (caseItem: Case) => {
    const appointment = caseItem.appointment;
    if (!appointment) return 'No appointment';

    switch (appointment.status) {
      case 'pending':
        return 'Pending automation';
      case 'checking':
        return 'Checking availability...';
      case 'found':
        return `Found: ${appointment.date} ${appointment.time}`;
      case 'booked':
        return `Booked: ${appointment.date} ${appointment.time}`;
      case 'failed':
        return 'Booking failed';
      default:
        return appointment.status;
    }
  };

  const renderCase = ({item}: {item: Case}) => (
    <TouchableOpacity
      style={styles.caseCard}
      onPress={() => navigation.navigate('Automation', {case: item})}>
      <View style={styles.caseHeader}>
        <Text style={styles.caseName}>{item.profile.fullName}</Text>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(item.appointment?.status || '')},
          ]}>
          <Text style={styles.statusText}>
            {item.appointment?.status || 'pending'}
          </Text>
        </View>
      </View>

      <Text style={styles.procedureName}>{item.procedure.name}</Text>
      <Text style={styles.appointmentStatus}>{getStatusText(item)}</Text>

      <View style={styles.caseFooter}>
        <Text style={styles.caseId}>Case ID: {item.id.slice(0, 8)}...</Text>
        <Text style={styles.caseDate}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.email}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {cases.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No cases found</Text>
          <Text style={styles.emptySubtext}>
            Create a case in the web app to start automation
          </Text>
        </View>
      ) : (
        <FlatList
          data={cases}
          renderItem={renderCase}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  listContent: {
    padding: 15,
  },
  caseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  caseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  procedureName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  appointmentStatus: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 10,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  caseId: {
    fontSize: 12,
    color: '#999',
  },
  caseDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default CaseListScreen;
