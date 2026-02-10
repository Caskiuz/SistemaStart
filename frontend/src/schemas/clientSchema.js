import * as z from 'zod';

export const clientSchema = z.object({
  business_name: z.string().min(3, "El nombre del negocio debe tener al menos 3 caracteres"),
  owner_name: z.string().min(3, "El nombre del dueño es obligatorio"),
  rif_cedula: z.string().min(5, "Documento de identidad demasiado corto"),
  email: z.string().email("Correo electrónico inválido").optional().or(z.literal('')),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  address: z.string().min(10, "La dirección debe ser más específica"),
});