import {
	ImageBackground,
	KeyboardAvoidingView,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	Image,
	View,
	TouchableOpacity,
	Keyboard,
	TouchableWithoutFeedback,
	ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import Button from '../components/Button';
import ImageBG from '../assets/background-mobile.png';
import Logo from '../assets/logo.png';
import { colors } from '../themes/colors';
import { typography } from '../themes/typography';
import CustomText from '../components/CustomText';
import * as SplashScreen from 'expo-splash-screen';
import { useRoute } from '@react-navigation/native';
import Loading from './Loading';
import { Auth } from 'aws-amplify';

const ConfirmEmail = ({ navigation }) => {
	const route = useRoute();
	const [code, setCode] = useState('');

	const [loading, setLoading] = useState(false);

	const onConfirmPressed = async () => {
		if (code === '') return;
		setLoading(true);
		try {
			await Auth.confirmSignUp(route?.params?.email, code);
			navigation.navigate('Login');
		} catch (err) {
			alert(err.message);
			console.log(err);
		} finally {
			SplashScreen.hideAsync();
			setLoading(false);
		}
	};
	const onResendPressed = async () => {
		try {
			await Auth.resendSignUp(route?.params?.email);
			alert('Success', 'Code was resent');
		} catch (err) {
			alert(err.message);
			console.log(err);
		} finally {
			SplashScreen.hideAsync();
		}
	};
	if (loading) {
		return <Loading />;
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<View
				style={{
					width: '90%',
					justifyContent: 'center',
					height: '30%',
					alignSelf: 'center',
				}}
			>
				<CustomText style={{ fontSize: 40 }}>Confirm</CustomText>
				<CustomText style={{ fontSize: 40 }}>Your Email</CustomText>
			</View>

			<View
				style={{
					gap: 15,
					justifyContent: 'space-around',
					alignItems: 'center',
				}}
			>
				<TextInput
					style={styles.input}
					value={code}
					onChangeText={setCode}
					inputMode="text"
					keyboardType="numeric"
					placeholder="Code"
					autoCapitalize="none"
				/>

				<Button
					text={loading ? 'Loading..' : 'Confirm'}
					onPress={() => onConfirmPressed()}
				/>
				<Button
					secondary
					text={loading ? 'Loading..' : 'Resend code'}
					onPress={() => onResendPressed()}
				/>
				<TouchableOpacity
					onPress={() => navigation.navigate('Register')}
				>
					<CustomText style={{ color: 'rgba(169, 169, 172, .5)' }}>
						Back to <CustomText> Sign up</CustomText>
					</CustomText>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default ConfirmEmail;

const styles = StyleSheet.create({
	input: {
		width: '90%',
		height: 50,
		paddingLeft: 10,
		backgroundColor: 'white',
		fontSize: typography.size.M,
		fontFamily: 'Montserrat',
		backgroundColor: 'transparent',
		borderBottomColor: 'rgba(169, 169, 172, .5)',
		borderBottomWidth: 1,
	},
	inputPassword: {
		fontSize: typography.size.M,
		fontFamily: 'Montserrat',
		paddingLeft: 10,
		width: '80%',
	},
	password: {
		width: '90%',
		height: 50,
		backgroundColor: 'transparent',
		borderBottomColor: 'rgba(169, 169, 172, .5)',
		borderBottomWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
});
