# Velvet Club — Backend (desarrollo)

Este backend sirve la carpeta `../frontend` y expone un endpoint `/api/profiles` con datos mock.

Requisitos:
- Node.js v14+ (recomendado)

Cómo ejecutar (Windows PowerShell / VS Code terminal):

```powershell
cd 'C:\Users\PC\Downloads\sergio\estudio\backend'
npm start
# Esto ejecuta el script 'setup' que instalará dependencias si faltan, y después arranca el servidor.
```

Luego abre: http://localhost:3000

Notas:
- En desarrollo el backend sirve archivos estáticos desde `../frontend`.
- Cuando tengas un backend real sustituiremos los mocks por consultas a la base de datos.
