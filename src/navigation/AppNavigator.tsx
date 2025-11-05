import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  NavigationContainer,
  ParamListBase,
  StackActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';
import routes from '../constants/routes';

// Authentication
import {
  SplashScreen,
  SignIn,
  SignUp,
  Connect,
  SignInEmail,
  ForgotPassword,
  SignUpEmail,
  SignUpPurpose,
} from '../screen/Authentication';

// Core Home
import {Home} from '../screen/Core';

// Frequency
import {Frequencies, AllFrequencies, Mood} from '../screen/Frequency';

// Settings
import {
  About,
  AccountInformation,
  BedtimeReminder,
  EditUserInfo,
  InviteFriends,
  MindfulReminder,
  Notifications,
  Privacy,
  SetPassword,
  Settings,
  Subscriptions,
  Terms,
  VoiceGuides,
} from '../screen/Settings';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../redux/store';
import {updatePlayingTime} from '../redux/slice/userSlice';

const authScreens = [
  {name: routes.CONNECT, component: Connect},
  {name: routes.SIGN_IN, component: SignIn},
  {name: routes.SIGN_UP, component: SignUp},
  {name: routes.SIGN_IN_EMAIL, component: SignInEmail},
  {name: routes.SIGN_UP_EMAIL, component: SignUpEmail},
  {name: routes.SIGN_UP_PURPOSE, component: SignUpPurpose},
  {name: routes.FORGOT_PASSWORD, component: ForgotPassword},
];

const homeScreens = [{name: routes.HOME, component: Home}];

const frequencyScreens = [
  {name: routes.FREQUENCIES, component: Frequencies},
  {name: routes.MOOD, component: Mood},
  {name: routes.ALLFREQUENCIES, component: AllFrequencies},
];

const settingsScreens = [
  {name: routes.SETTINGS, component: Settings},
  {name: routes.ACCOUNT_INFO, component: AccountInformation},
  {name: routes.EDIT_USER_INFO, component: EditUserInfo},
  {name: routes.SET_PASSWORD, component: SetPassword},
  {name: routes.SUBSCRIPTIONS, component: Subscriptions},
  {name: routes.NOTIFICATIONS, component: Notifications},
  {name: routes.MINDFUL_REMINDER, component: MindfulReminder},
  {name: routes.BEDTIME_REMINDER, component: BedtimeReminder},
  {name: routes.INVITE_FRIENDS, component: InviteFriends},
  {name: routes.VOICE_GUIDES, component: VoiceGuides},
  {name: routes.ABOUT, component: About},
  {name: routes.PRIVACY_SECURITY, component: Privacy},
  {name: routes.TERMS_CONDITION, component: Terms},
];

const renderScreens = (screens: any[]) =>
  screens.map(({name, component, options}) => (
    <Stack.Screen
      key={name}
      name={name}
      component={component}
      options={options}
    />
  ));

const Stack = createStackNavigator();

export const navigationRef = createNavigationContainerRef<ParamListBase>();
export function navigate(
  name: keyof ParamListBase,
  params?: ParamListBase[keyof ParamListBase],
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}
export function reset(
  name: keyof ParamListBase,
  params?: ParamListBase[keyof ParamListBase],
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name, params}],
      }),
    );
  }
}

export function replace(
  name: keyof ParamListBase,
  params?: ParamListBase[keyof ParamListBase],
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}

function AppNavigator() {
  const dispatch = useDispatch();
  const user = useAppSelector(state => state.user);

  useEffect(() => {
    if (!user._id) {return;}

    const today = new Date().toDateString();

    // ✅ Startup guard
    if (user.playingTime?.lastPlayingTimeDate !== today) {
      dispatch(
        updatePlayingTime({
          count: 0,
          lastPlayingTimeDate: today,
        }),
      );
      console.log('Reset because app reopened on a new day');
    }

    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();

    const timer = setTimeout(() => {
      dispatch(
        updatePlayingTime({
          count: 0,
          lastPlayingTimeDate: new Date().toDateString(),
        }),
      );
      console.log('Hitting reset playing time');
    }, msUntilMidnight);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={routes.SPLASH_SCREEN}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name={routes.SPLASH_SCREEN} component={SplashScreen} />
        {renderScreens(authScreens)}
        {renderScreens(homeScreens)}
        {renderScreens(frequencyScreens)}
        {renderScreens(settingsScreens)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
