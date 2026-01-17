# Server Actions vs API Routes - Guía 2026

## ¿Cuándo usar Server Actions (`app/actions/`)?

✅ **Usa Server Actions para:**

- Formularios internos (landing page, contactos)
- Acciones del usuario dentro de la app
- Operaciones CRUD desde componentes React
- Procesos que solo se usan dentro de tu aplicación

**Ventajas:**

- ✅ Protección CSRF automática
- ✅ TypeScript end-to-end (tipos viajan del servidor al cliente)
- ✅ Menos código (no necesitas crear rutas separadas)
- ✅ Mejor rendimiento (menos roundtrips HTTP)
- ✅ Integración directa con formularios HTML nativos
- ✅ Validación con Zod integrada
- ✅ No necesitas axios/fetch en el cliente

**Ejemplo:**

```typescript
// app/actions/contacts.ts
'use server';
export async function createContactAction(data) {
  // Validación, lógica, guardar en DB
}
```

```jsx
// app/page.js
<form action={createContactAction}>{/* Formulario */}</form>
```

---

## ¿Cuándo usar API Routes (`app/api/`)?

✅ **Usa API Routes para:**

- Webhooks externos (Stripe, PayPal, etc.)
- Integraciones con servicios externos
- APIs públicas que otros servicios consumen
- Endpoints que necesitan ser accesibles desde fuera de tu app
- Next-Auth (requiere API Route específica)

**Ventajas:**

- ✅ Accesible desde cualquier cliente (móvil, desktop, otros servicios)
- ✅ URLs públicas y documentables
- ✅ Compatible con estándares REST
- ✅ Puedes usar desde cualquier lenguaje/framework

**Ejemplo:**

```javascript
// app/api/webhooks/stripe/route.js
export async function POST(request) {
  // Recibir webhook de Stripe
}
```

---

## Estado Actual del Proyecto

### ✅ Server Actions (Moderno - 2026)

- `app/actions/contacts.ts` - Usado en:
  - Landing page (`app/page.js`)
  - Admin panel (`app/admin/contacts/page.js`)

### ❌ API Routes (Obsoleto - Ya no se usa)

- `app/api/contacts/route.js` - **OBSOLETO** (reemplazado por Server Actions)
- `app/api/contacts/[id]/route.js` - **OBSOLETO** (reemplazado por Server Actions)
- `utils/api/contactsApi.js` - **OBSOLETO** (ya no se importa)

### ✅ API Routes (Necesario - Mantener)

- `app/api/auth/[...nextauth]/route.js` - **NECESARIO** (Next-Auth requiere API Route)

---

## Recomendación

**Eliminar código obsoleto:**

1. `app/api/contacts/route.js` - Ya no se usa
2. `app/api/contacts/[id]/route.js` - Ya no se usa
3. `utils/api/contactsApi.js` - Ya no se usa

**Mantener:**

- `app/actions/contacts.ts` - Arquitectura moderna
- `app/api/auth/[...nextauth]/route.js` - Requerido por Next-Auth
