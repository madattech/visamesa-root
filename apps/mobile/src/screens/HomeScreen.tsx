import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigator';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const {styles} = useStyles(stylesheet);

  const handleStartAutomation = () => {
    navigation.navigate('WebsiteWebView', {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleStartAutomation}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Start Automation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xxxl,
    borderRadius: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.labelLarge.fontSize,
    fontWeight: theme.typography.labelLarge.fontWeight,
    lineHeight: theme.typography.labelLarge.lineHeight,
    textAlign: 'center',
  },
}));

export default HomeScreen;
