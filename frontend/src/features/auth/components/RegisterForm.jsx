import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterForm() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [localErrors, setLocalErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        phone: '',
        email: '',
        password: '',
        role: 'VENTAS'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (localErrors[name]) {
            const newLocalErrors = { ...localErrors };
            delete newLocalErrors[name];
            setLocalErrors(newLocalErrors);
        }
        if (error) setError(null);
    };

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (formData.first_name.trim().length < 2) errors.first_name = "Nombre demasiado corto";
        if (formData.last_name.trim().length < 2) errors.last_name = "Apellido demasiado corto";
        if (formData.username.trim().length < 4) errors.username = "El usuario debe tener al menos 4 caracteres";
        if (!emailRegex.test(formData.email)) errors.email = "Ingrese un correo electrónico válido";
        if (formData.password.length < 8) errors.password = "La contraseña requiere mínimo 8 caracteres";
        
        if (formData.phone && !/^\d{7,15}$/.test(formData.phone)) {
            errors.phone = "Ingrese un número entre 7 y 15 dígitos";
        }

        setLocalErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setError(null);

        const result = await register(formData);

        if (result.success) {
            setIsSuccess(true);
            setTimeout(() => navigate("/"), 2000);
        } else {
            setError(result.errors || { message: result.message });
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-slate-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-xl font-medium text-slate-800">Usuario Registrado</h2>
                <p className="text-sm text-slate-500 mt-2">Redireccionando a la base de datos...</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center p-6 bg-slate-50/50 min-h-screen font-sans antialiased">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full max-w-[550px] p-10 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 rounded-2xl gap-5"
            >
                <header className="border-b border-slate-100 pb-6">
                    <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Registro de usuario</h2>
                    <p className="text-slate-400 text-[10px] font-medium uppercase tracking-[0.15em] mt-1.5">Formulario para asignar usuarios</p>
                </header>

                {(error?.message || Object.keys(localErrors).length > 0) && (
                    <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                        <p className="text-rose-600 text-[11px] font-medium text-center">
                            {error?.message || "Por favor, revise los campos marcados en rojo."}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Nombre" name="first_name" type="text" value={formData.first_name} onChange={handleInputChange} error={localErrors.first_name} />
                    <Field label="Apellido" name="last_name" type="text" value={formData.last_name} onChange={handleInputChange} error={localErrors.last_name} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="ID Usuario" name="username" type="text" value={formData.username} onChange={handleInputChange} error={localErrors.username || error?.username?.[0]} />
                    <Field label="Teléfono" name="phone" type="text" value={formData.phone} onChange={handleInputChange} error={localErrors.phone || error?.phone?.[0]} placeholder="Solo números" />
                </div>

                <Field label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleInputChange} error={localErrors.email || error?.email?.[0]} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Contraseña" name="password" type="password" value={formData.password} onChange={handleInputChange} error={localErrors.password} />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1">Rol Operativo</label>
                        <select name="role" value={formData.role} onChange={handleInputChange} className="border border-slate-200 bg-slate-50/30 p-2.5 rounded-xl outline-none focus:bg-white text-sm text-slate-600 font-medium cursor-pointer">
                            <option value="GERENCIA">Gerencia</option>
                            <option value="CONTABILIDAD">Contabilidad</option>
                            <option value="VENTAS">Ventas</option>
                            <option value="ALMACEN">Almacén</option>
                            <option value="DISTRIBUCION">Distribución</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-4 p-3.5 rounded-xl font-semibold transition-all text-xs uppercase tracking-widest shadow-sm ${
                        isSubmitting 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]'
                    }`}
                >
                    {isSubmitting ? 'Registrando...' : 'Registrar usuario'}
                </button>
            </form>
        </div>
    );
}

function Field({ label, error, ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-slate-400 uppercase ml-1">{label}</label>
            <input 
                {...props}
                className={`border ${error ? 'border-rose-300' : 'border-slate-200'} bg-slate-50/30 p-2.5 rounded-xl focus:bg-white focus:border-slate-400 outline-none transition-all text-sm text-slate-700`}
            />
            {error && <span className="text-rose-500 text-[9px] font-medium ml-1 leading-none">{error}</span>}
        </div>
    );
}