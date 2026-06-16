#!/usr/bin/env bash
# init.sh — Verificación e inicialización del harness SDD
#
# Este script lo ejecuta el agente al COMENZAR una sesión y antes de
# declarar cualquier tarea como `done`. Si falla, la sesión no debe avanzar.
#
# Adaptado para Next.js 16 single-app (no monorepo). Auto-detecta sufijo
# .harness si existe, funciona sin feature_list.json (avisa, no aborta).

set -u
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()    { printf "${GREEN}[OK]${NC}    %s\n" "$1"; }
warn()  { printf "${YELLOW}[WARN]${NC}  %s\n" "$1"; }
fail()  { printf "${RED}[FAIL]${NC}  %s\n" "$1"; }

EXIT_CODE=0

echo "── 1. Verificando entorno ─────────────────────────────"

if ! command -v node >/dev/null 2>&1; then
  fail "node no está instalado"
  exit 1
fi
ok "node -> $(node --version)"

if command -v pnpm >/dev/null 2>&1; then
  PKG_MANAGER="pnpm"
  ok "pnpm -> $(pnpm --version)"
elif command -v npm >/dev/null 2>&1; then
  PKG_MANAGER="npm"
  ok "npm -> $(npm --version)"
else
  fail "ni pnpm ni npm están instalados"
  exit 1
fi

NODE_VERSION=$(node -e "console.log(process.version.match(/^v(\d+)/)[1])")
if [ "$NODE_VERSION" -lt 18 ]; then
  fail "Se requiere Node.js >= 18 (actual: $(node --version))"
  exit 1
fi
ok "Versión de Node.js compatible"

if command -v docker >/dev/null 2>&1; then
  ok "docker disponible"
else
  warn "docker no está disponible (necesario solo para BD local)"
fi

echo ""
echo "── 2. Verificando archivos base del arnés ─────────────"

# Auto-detectar sufijo .harness
if [ -f "feature_list.harness.json" ]; then
  SUFFIX=".harness"
  FEATURE_LIST="feature_list.harness.json"
  PROGRESS_DIR="progress.harness"
  FEATURES_DIR="features.harness"
  TOOLS_DIR="tools.harness"
  AGENTS_FILE="AGENTS.harness.md"
  CHECKPOINTS_FILE="CHECKPOINTS.harness.md"
elif [ -f "feature_list.json" ]; then
  SUFFIX=""
  FEATURE_LIST="feature_list.json"
  PROGRESS_DIR="progress"
  FEATURES_DIR="features"
  TOOLS_DIR="tools"
  AGENTS_FILE="AGENTS.harness.md"
  CHECKPOINTS_FILE="CHECKPOINTS.harness.md"
else
  SUFFIX=""
  FEATURE_LIST=""
  PROGRESS_DIR="progress"
  FEATURES_DIR="features"
  TOOLS_DIR="tools"
  AGENTS_FILE="AGENTS.harness.md"
  CHECKPOINTS_FILE="CHECKPOINTS.harness.md"
  warn "No se encontró feature_list.json — se omite la validación de features (créalo cuando empieces una)"
fi

ok "Sufijo detectado: ${SUFFIX:-ninguno}"
ok "Feature list:     ${FEATURE_LIST:-(no existe aún)}"

# Archivos del harness (hemos puesto los del flujo SDD con sufijo .harness.md)
REQUIRED_FILES=(
  "$AGENTS_FILE"
  "AGENTS_2.harness.md"
  "$CHECKPOINTS_FILE"
  "jest.config.js"
  "jest.setup.js"
  "$TOOLS_DIR/mutate.js"
  "$PROGRESS_DIR/current.md"
  "$PROGRESS_DIR/history.md"
  "docs/architecture.md"
  "docs/conventions.md"
  "docs/verification.md"
  "docs/workflow.md"
  "package.json"
)

for f in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$f" ]; then
    fail "Falta archivo base: $f"
    EXIT_CODE=1
  else
    ok "Existe $f"
  fi
done

# El AGENTS.md raíz es de Next.js 16 (instrucciones del CLI), no del harness
if [ -f "AGENTS.md" ] && [ "$AGENTS_FILE" != "AGENTS.md" ]; then
  ok "Existe AGENTS.md (instrucciones de Next.js 16, conservado tal cual)"
fi

# tsconfig es opcional
if [ -f "tsconfig.json" ]; then
  ok "Existe tsconfig.json"
else
  warn "tsconfig.json no existe (opcional)"
fi

# Validar feature_list solo si existe
if [ -n "$FEATURE_LIST" ] && [ -f "$FEATURE_LIST" ]; then
  echo ""
  echo "── 3. Validando $FEATURE_LIST y escenarios ────────"

  node - "$FEATURE_LIST" "$FEATURES_DIR" <<'JS'
const fs = require('fs');
const path = require('path');

const featureListFile = process.argv[2];
const featuresDir = process.argv[3];

try {
  const data = JSON.parse(fs.readFileSync(featureListFile, 'utf8'));
  const valid = new Set(['pending', 'spec_ready', 'in_progress', 'done', 'blocked']);
  const inProgress = data.features.filter(f => f.status === 'in_progress');

  if (inProgress.length > 1) {
    console.log(`[FAIL]  Hay ${inProgress.length} features en in_progress (máximo 1)`);
    process.exit(1);
  }

  const requiresSpec = new Set(['spec_ready', 'in_progress', 'done']);
  const specErrors = [];

  for (const f of data.features) {
    if (!valid.has(f.status)) {
      console.log(`[FAIL]  Estado inválido en feature ${f.id}: ${f.status}`);
      process.exit(1);
    }
    if (f.sdd && requiresSpec.has(f.status)) {
      const featureFile = path.join(featuresDir, f.name + '.feature');
      if (!fs.existsSync(featureFile)) {
        specErrors.push(
          `feature ${f.id} (${f.name}) en ${f.status} sin ${featureFile}`
        );
      }
    }
  }

  if (specErrors.length > 0) {
    for (const e of specErrors) {
      console.log(`[FAIL]  ${e}`);
    }
    process.exit(1);
  }

  console.log(`[OK]    ${featureListFile} válido (${data.features.length} features)`);
  console.log(`[OK]    Escenarios .feature presentes para features sdd no-pending`);

  const counts = {};
  for (const f of data.features) {
    counts[f.status] = (counts[f.status] || 0) + 1;
  }
  console.log(`[INFO]  Estados: ${JSON.stringify(counts)}`);
} catch (e) {
  console.log(`[FAIL]  ${featureListFile} o specs inválidos: ${e.message}`);
  process.exit(1);
}
JS

  if [ $? -ne 0 ]; then EXIT_CODE=1; fi
else
  echo ""
  echo "── 3. Validación de features omitida (no hay feature_list.json) ──"
fi

echo ""
echo "── 4. Permisos de .next/ ──────────────────────────────"

if [ -d ".next" ]; then
  OWNER=$(stat -c '%U' ".next" 2>/dev/null || echo "unknown")
  if [ "$OWNER" = "root" ]; then
    warn ".next es de root — intentando arreglar con sudo"
    echo "" | sudo -S chown -R "$(whoami):$(whoami)" ".next" 2>/dev/null
    if [ $? -eq 0 ]; then
      ok "Permisos de .next arreglados"
    else
      warn "No se pudo arreglar permisos de .next (sudo requiere contraseña)"
    fi
  else
    ok ".next tiene permisos correctos"
  fi
else
  warn ".next no existe todavía (se creará con next dev/build)"
fi

echo ""
echo "── 5. Stack Next.js 16 ─────────────────────────────────"
ok "Next.js 16 detectado — lee node_modules/next/dist/docs/ antes de escribir código"
warn "Tailwind v4: configuración basada en CSS, no en tailwind.config.js"
warn "Jest configurado con next/jest (NO uses ts-jest directamente)"

echo ""
echo "── 6. Resumen ──────────────────────────────────────────"

if [ $EXIT_CODE -eq 0 ]; then
  ok "Entorno listo. Puedes empezar a trabajar."
  echo ""
  echo "  Sufijo detectado:  ${SUFFIX:-ninguno}"
  echo "  Package manager:   $PKG_MANAGER"
  echo "  Feature list:      ${FEATURE_LIST:-(no existe)}"
  echo "  Features dir:      $FEATURES_DIR"
  echo "  Progress dir:      $PROGRESS_DIR"
  echo "  Tools dir:         $TOOLS_DIR"
  echo ""
  echo "  Próximos pasos:"
  echo "    1. Lee docs/workflow.md para entender el flujo SDD"
  echo "    2. Lee AGENTS_2.harness.md como mapa del repositorio"
  echo "    3. Crea feature_list.json y project-spec.md cuando empieces una feature"
else
  fail "Entorno NO está listo. Resuelve los errores antes de avanzar."
fi

exit $EXIT_CODE
