# Trazabilidad documental de compromisos presidenciales - Keiko Fujimori

Plataforma web para analizar compromisos publicos desde documentos de campana y gobierno hasta acciones, presupuesto, ejecucion y resultados.

La version actual carga insumos locales de debates, plan de gobierno de Fuerza Popular y mensaje presidencial. El universo inicial incluye 446 registros del plan, 81 declaraciones de debate y ofrecimientos extraidos del mensaje presidencial. Los compromisos quedan registrados con su documento de origen; el cumplimiento parte como `Por cumplir` y cambia solo ante acciones, normas, presupuesto, ejecucion o resultados posteriores.

## Stack

- Next.js App Router
- TypeScript estricto
- Prisma schema para PostgreSQL
- APIs modulares para fuentes, compromisos y exportacion
- Pruebas con `node --test`

## Instalacion

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

Abra `http://localhost:3000`.

## Validacion

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

## Variables de entorno

- `DATABASE_URL`: conexion PostgreSQL para Prisma.
- `ADMIN_DEMO_TOKEN`: token placeholder para proteger flujos administrativos cuando se conecte autenticacion real.
- `NEXT_PUBLIC_APP_MODE`: use `demo` mientras existan datos simulados.

## Flujos disponibles

- Panel general con universo documental, cobertura e indicadores.
- Explorador con busqueda, filtros, tabla y exportacion CSV/JSON.
- Ficha de compromiso con texto original, normalizacion, evidencia, acciones, comparaciones e historial.
- Comparador de evolucion por par de fuentes: conserva, reformula, matiza, marca omisiones y detecta apariciones nuevas entre plan, debates y mensaje presidencial.
- Linea de tiempo desde compromiso hasta accion.
- Administracion demo para registrar fuente y simular permisos por rol.
- Pagina de metodologia con limites del sistema e IA.

Las rutas `POST /api/sources` y `POST /api/commitments` exigen el header `x-demo-role` con `ADMIN`, `ANALYST` o `REVIEWER`. En produccion debe reemplazarse por autenticacion real.

## Estados de cumplimiento

Los compromisos provenientes del plan de gobierno, debates y discursos se consideran fuentes documentales registradas
cuando conservan cita o extracto y referencia al insumo. Eso no significa que esten cumplidos.

El estado inicial de cumplimiento es `Por cumplir`, especialmente al inicio del gobierno. Solo cambia cuando una fuente
posterior acredita accion gubernamental:

1. Iniciativa formal.
2. Norma aprobada.
3. Presupuesto asignado.
4. Ejecucion.
5. Resultado verificado.
