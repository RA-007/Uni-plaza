import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleOtpSend = async () => {
    await axios.post('/api/auth/forgot-password', { email });
    setStep(2);
  };

  const handleReset = async () => {
    await axios.post('/api/auth/reset-password', { email, otp, newPassword });
    alert('Password reset successful');
  };

  return (
    <div>
      {step === 1 ? (
        <>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <button onClick={handleOtpSend}>Send OTP</button>
        </>
      ) : (
        <>
          <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="OTP" />
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" />
          <button onClick={handleReset}>Reset Password</button>
        </>
      )}
    </div>
  );
}
