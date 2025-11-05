import React, { useState, useRef } from 'react';
import { View, TextInput } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { styles } from './styles';

interface OTPInputProps {
    onChange: (otp: string) => void;
    onFinish?: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ onChange }) => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const otpInputs = useRef<TextInput[]>([]);
    const [focusedInput] = useState<number | null>(null);

    const focusInput = (index: number) => {
        otpInputs.current[index]?.focus();
    };

    const handleInputChange = (text: string, index: number) => {
        if (isNaN(Number(text))) {
            return;
        }
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        onChange(newOtp.join(''));
        const isAllFilled = newOtp.every(digit => digit !== '');

        if (isAllFilled) {
            // const code = newOtp.join('');
        } else if (text !== '') {
            focusInput(index + 1);
        } else {
            focusInput(index - 1);
        }
    };

    return (
        <View style={styles.container}>
            {otp.map((digit, index) => (
                <TextInput
                    key={index}
                    style={[
                        styles.input,
                        {
                            borderColor:
                                index === focusedInput
                                    ? Colors.black
                                    : otp[index] !== ''
                                        ? Colors.black
                                        : '#ADB6BE',
                        },
                    ]}
                    keyboardType="numeric"
                    maxLength={1}
                    onChangeText={text => handleInputChange(text, index)}
                    value={digit}
                    ref={ref => (otpInputs.current[index] = ref as TextInput)}
                />
            ))}
        </View>
    );
};

export default OTPInput;
