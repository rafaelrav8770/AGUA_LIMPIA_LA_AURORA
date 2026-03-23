# Instrucciones de Despliegue - Agua Limpia La Aurora

## 1. Configuración de Base de Datos en Supabase

1. Crea una cuenta y un nuevo proyecto en [Supabase](https://supabase.com/).
2. Copia la `Project URL` y la `API Key (anon, public)` desde Project Settings > API.
3. Dirígete a la sección de **SQL Editor** en Supabase.
4. Pega el contenido del archivo `supabase/schema.sql` y ejecútalo para crear las tablas y políticas de seguridad (RLS).
5. Opcionalmente, ejecuta el archivo `supabase/seed.sql` para tener datos de prueba.
6. Dirígete a **Authentication > Users** y crea manualmente a los 2 usuarios administradores (con correo y contraseña).
7. (Opcional) Desactiva los registros de nuevos usuarios en "Authentication > Providers > Email" desmarcando "Enable Email Signup".

## 2. Configuración en Vercel

1. Crea un repositorio en GitHub, GitLab o Bitbucket y sube este código.
2. Inicia sesión en [Vercel](https://vercel.com/) y crea un nuevo proyecto importando el repositorio.
3. En la sección de "Environment Variables", añade las siguientes claves:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Tu URL de Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Tu Anon Key de Supabase)
4. Haz clic en **Deploy**.

## 3. Desarrollo Local

Si deseas correr la aplicación localmente:
1. Crea un archivo `.env.local` en la raíz del proyecto.
2. Añade las mismas variables de entorno:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
   ```
3. Ejecuta `npm run dev` para iniciar el servidor de desarrollo.

El sistema se ha construido para ser Mobile-first utilizando Tailwind CSS, asegurando que se adapte perfectamente al uso en rutas desde un celular, con controles grandes y legibles.
