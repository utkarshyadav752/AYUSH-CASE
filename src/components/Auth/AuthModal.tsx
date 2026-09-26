import React, { useState } from 'react';
import { 
  ShieldCheck, Sparkles, User, Lock, Mail, Phone, ArrowRight, 
  CheckCircle2, KeyRound, AlertCircle, HeartHandshake, Eye, EyeOff
} from 'lucide-react';
import { DEMO_USERS, UserAccount } from '../../data/mockUsers';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'abha' | 'email'>('abha');
  const [abhaOrEmail, setAbhaOrEmail] = useState('91-4829-1029-3841');
  const [password, setPassword] = useState('ayush2026');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('Sunita Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [age, setAge] = useState('46');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor'>('patient');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (mode === 'login') {
        // Quick match with demo users or create dynamic profile
        const matched = DEMO_USERS.find(
          u => u.email.toLowerCase() === abhaOrEmail.toLowerCase() ||
               (u.abhaId && u.abhaId.replace(/-/g, '') === abhaOrEmail.replace(/-/g, ''))
        );

        if (matched) {
          onLoginSuccess(matched);
        } else {
          // Allow login with created credentials
          const generatedUser: UserAccount = {
            id: `USR-${Date.now().toString().slice(-4)}`,
            name: abhaOrEmail.includes('@') ? abhaOrEmail.split('@')[0] : 'Ayush Patient',
            email: abhaOrEmail.includes('@') ? abhaOrEmail : `${abhaOrEmail}@abha.gov.in`,
            phone: '+91 98765 00000',
            role: selectedRole,
            abhaId: abhaOrEmail.includes('@') ? '91-9988-7766-5544' : abhaOrEmail,
            age: 40,
            gender: 'Female',
            registeredDate: new Date().toISOString().split('T')[0],
            pastCaseCount: 1,
            prakritiBaseline: 'Tridoshic Balanced'
          };
          onLoginSuccess(generatedUser);
        }
      } else {
        // Sign-up flow
        const newUser: UserAccount = {
          id: `USR-${Date.now().toString().slice(-4)}`,
          name: fullName || 'New Ayush Patient',
          email: abhaOrEmail.includes('@') ? abhaOrEmail : `${phone}@abha.gov.in`,
          phone: phone || '+91 98000 00000',
          role: selectedRole,
          abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          age: Number(age) || 35,
          gender: gender,
          registeredDate: new Date().toISOString().split('T')[0],
          pastCaseCount: 0,
          prakritiBaseline: 'Assessment in progress'
        };
        onLoginSuccess(newUser);
      }
      onClose();
    }, 450);
  };

  const handleSelectDemoUser = (user: UserAccount) => {
    setAbhaOrEmail(user.abhaId || user.email);
    setSelectedRole(user.role as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden relative">
        {/* Top Government Ribbon */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-amber-900 text-white text-[11px] px-5 py-2 font-medium flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Ayushman Bharat Digital Mission (ABDM)</span>
          </div>
          <span className="text-amber-200 font-mono text-[10px]">Secure Gateway</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-lg font-bold"
        >
          ×
        </button>

        <div className="p-6 sm:p-7 space-y-5">
          {/* Header */}
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {mode === 'login' ? 'Citizen & Patient Login' : 'Create Ayush Account'}
                </h3>
                <p className="text-xs text-slate-500">
                  Unified access to Voice Intake, Case Sheets, and ABDM Records
                </p>
              </div>
            </div>
          </div>

          {/* Role Selector */}
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedRole('patient')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedRole === 'patient'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Patient / Citizen
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('doctor')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedRole === 'doctor'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vaidya / Clinician (HPR)
            </button>
          </div>

          {/* Quick Demo Pre-fill Chips */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              1-Click Demo Profiles:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectDemoUser(u)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                    abhaOrEmail === u.abhaId || abhaOrEmail === u.email
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {u.name} ({u.role})
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Name (As per Aadhaar/ABHA)
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g., Sunita Sharma"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 bg-white cursor-pointer"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Mobile Number (For OTP verification)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 bg-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                ABHA 14-Digit Number or Email Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={abhaOrEmail}
                  onChange={(e) => setAbhaOrEmail(e.target.value)}
                  placeholder="91-XXXX-XXXX-XXXX or name@email.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-700">
                  Password / M-PIN
                </label>
                {mode === 'login' && (
                  <span className="text-[10px] text-emerald-700 hover:underline cursor-pointer">
                    Forgot PIN?
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 bg-white pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating with ABDM...' : mode === 'login' ? 'Sign In & Access Case Sheets' : 'Register & Generate ABHA Profile'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Login / Signup */}
          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Don't have an Ayush ABHA record?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  Create New Account
                </button>
              </p>
            ) : (
              <p>
                Already have an ABHA Health ID?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
