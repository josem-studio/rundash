# RUNDASH Architecture & Roadmap

## Arquitectura (ARCHITECTURE.md)

RUNDASH sigue una arquitectura basada en capas para garantizar la separación de preocupaciones y facilitar la futura transición a una aplicación móvil nativa.

### Capas del sistema
1.  **UI Layer (`src/components`)**: Componentes de presentación orientados a la estética premium. Utiliza `tailwind-merge` y `clsx` para la composición de estilos.
2.  **Domain Layer (`src/types`)**: Definiciones de tipos y modelos de datos (ej. `Activity`, `Goal`, `AthleteProfile`).
3.  **Data Access Layer (`src/services`)**: Abstracción del acceso a datos. Los componentes no deben importar `mockData.ts` directamente; usarán servicios que devuelven datos unificados, permitiendo cambiar el origen de datos (Mock -> Strava -> Garmin) sin cambios en la UI.
4.  **Utils (`src/utils`)**: Funciones puras de formateo (duración, fecha, métricas).

---

## Roadmap (ROADMAP.md)

### Fase 1: Auditoría y Rediseño
- [x] Corrección de configuración (Tailwind v4/PostCSS).
- [ ] Definición de Design Tokens.
- [ ] Implementación de `Data Layer` (abstracción).
- [ ] Rediseño visual del Dashboard con estética premium.

### Fase 2: Modelo Deportivo
- [ ] Definición del perfil del atleta.
- [ ] Estructuración de objetivos dinámicos.
- [ ] Implementación de la "Pista de Running" (Widget).

### Fase 3: Integración Strava
- [ ] Backend para autenticación OAuth (fuera del frontend).
- [ ] Servicio de sincronización de actividades.

### Fase 4: Garmin & Entrenador Inteligente
- [ ] Investigación de APIs.
- [ ] Lógica de planificación adaptativa.

### Fase 5: Mobile Ready
- [ ] Preparación para Capacitor.
- [ ] Implementación de notificaciones y widgets nativos.
