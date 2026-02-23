

## Plan: Panel de Resultados de Tests para Administradores

### Resumen
Agregar una nueva pestana "Tests" al panel de administracion donde los admins puedan ver todos los resultados de assessments de todos los usuarios, con filtros por tipo de test y estadisticas generales.

### Cambios necesarios

**1. Migracion de base de datos**
- Agregar una politica RLS en `assessment_results` que permita a los admins ver todos los resultados:
  ```sql
  CREATE POLICY "Admins can view all assessment results"
  ON public.assessment_results FOR SELECT
  USING (has_role(auth.uid(), 'admin'));
  ```

**2. Modificar `src/pages/Admin.tsx`**
- Agregar un nuevo componente `AssessmentsTab` que:
  - Consulte todos los registros de `assessment_results` ordenados por fecha
  - Haga join con `profiles` para mostrar el nombre del usuario (display_name) en vez del UUID
  - Muestre estadisticas resumidas: total de tests, promedio por tipo, numero de usuarios que han completado tests
  - Muestre una tabla/lista con: usuario, tipo de test, puntuacion (%), fecha
  - Incluya filtro por tipo de assessment (stress, emotional_regulation, cultural_adaptation, work_life_balance)
- Agregar la pestana "Tests" al `TabsList` (pasando de 5 a 6 columnas) con icono `ClipboardCheck`
- Agregar el `TabsContent` correspondiente

### Seccion tecnica

**Componente AssessmentsTab:**
- Query: `supabase.from("assessment_results").select("*").order("created_at", { ascending: false })`
- Query secundaria para perfiles: `supabase.from("profiles").select("user_id, display_name")` (requiere politica RLS de admin para profiles)
- Se necesita tambien una politica RLS para que admins puedan leer profiles:
  ```sql
  CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (has_role(auth.uid(), 'admin'));
  ```

**Estructura visual:**
- Resumen con cards: total tests completados, promedio general, usuarios activos
- Filtro dropdown por tipo de test
- Lista de resultados mostrando: nombre usuario, tipo test, porcentaje, fecha
- Cada tipo de test usa los labels existentes del mapa `typeLabels`

**Cambio en TabsList:**
- `grid-cols-5` pasa a `grid-cols-6`
- Nueva pestana con icono ClipboardCheck y texto "Tests"

